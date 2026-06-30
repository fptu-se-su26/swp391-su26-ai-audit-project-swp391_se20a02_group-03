using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.IdentityModel.Tokens;
using ProSport.Application.Interfaces;
using ProSport.Application.Services;
using ProSport.Infrastructure.Data;
using ProSport.Infrastructure.Repositories;
using ProSport.Infrastructure.Services;
using ProSport.API.Filters;
using ProSport.API.Hubs;
using ProSport.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserContext, CurrentUserContext>();
builder.Services.AddScoped<OwnerApiAuthorizationFilter>();
builder.Services.AddControllers(options =>
{
    options.Filters.Add<OwnerApiAuthorizationFilter>();
});
builder.Services.AddEndpointsApiExplorer();

// Configure Swagger with JWT Auth
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "ProSport API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,
            },
            new List<string>()
        }
    });
});

// Configure Database
builder.Services.AddDbContext<ProSportDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sql => sql.MigrationsAssembly(typeof(ProSportDbContext).Assembly.GetName().Name)));

// Configure Dependency Injection
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IOtpCodeRepository, OtpCodeRepository>();
builder.Services.AddScoped<ICourtRepository, CourtRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IEquipmentRepository, EquipmentRepository>();
builder.Services.AddScoped<IMatchRepository, MatchRepository>();
builder.Services.AddScoped<IEscrowRepository, EscrowRepository>();
builder.Services.AddScoped<IEquipmentCategoryRepository, EquipmentCategoryRepository>();
builder.Services.AddScoped<IInventoryRepository, InventoryRepository>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// Owner and Complex Services
builder.Services.AddScoped<IComplexRepository, ComplexRepository>();
builder.Services.AddScoped<IComplexOwnerRepository, ComplexOwnerRepository>();
builder.Services.AddScoped<IStaffAssignmentRepository, StaffAssignmentRepository>();
builder.Services.AddScoped<IRentalSessionRepository, RentalSessionRepository>();
builder.Services.AddScoped<IOwnerAccessService, OwnerAccessService>();
builder.Services.AddScoped<IOwnerDashboardService, OwnerDashboardService>();
builder.Services.AddScoped<IOwnerStaffService, OwnerStaffService>();
builder.Services.AddScoped<IOwnerCourtService, OwnerCourtService>();
builder.Services.AddScoped<IAuditLogService, AuditLogService>();
builder.Services.AddScoped<IComplexScheduleService, ComplexScheduleService>();
builder.Services.AddScoped<IStaffOperationGuard, StaffOperationGuard>();
builder.Services.AddScoped<IOwnerInventoryService, OwnerInventoryService>();
builder.Services.AddScoped<IOwnerRentalService, OwnerRentalService>();
builder.Services.AddScoped<IOwnerReportService, OwnerReportService>();
builder.Services.AddScoped<IOwnerReviewService, OwnerReviewService>();
builder.Services.AddScoped<IOwnerVoucherService, OwnerVoucherService>();
builder.Services.AddScoped<ICourtService, CourtService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IMatchService, MatchService>();
builder.Services.AddScoped<IEscrowService, EscrowService>();
builder.Services.AddScoped<IEquipmentCategoryService, EquipmentCategoryService>();
builder.Services.AddScoped<IEquipmentService, EquipmentService>();
builder.Services.AddScoped<IEquipmentRentalRepository, EquipmentRentalRepository>();
builder.Services.AddScoped<IEquipmentRentalService, EquipmentRentalService>();
builder.Services.AddScoped<IInventoryService, InventoryService>();
builder.Services.AddScoped<IVnPayService, VnPayService>();
builder.Services.AddScoped<IStorageService, LocalStorageService>();
builder.Services.AddScoped<IChatbotService, ChatbotService>();
builder.Services.AddScoped<ICartRepository, CartRepository>();
builder.Services.AddScoped<ICartService, CartService>();
// TK-010: quản lý người dùng (Admin)
builder.Services.AddScoped<IUserService, UserService>();
// TK-035: đánh giá người chơi + Trust Score
builder.Services.AddScoped<IPlayerRatingRepository, PlayerRatingRepository>();
builder.Services.AddScoped<IRatingService, RatingService>();
// Admin Dashboard: tổng hợp số liệu tổng quan
builder.Services.AddScoped<IDashboardService, DashboardService>();
// Voucher giảm giá (Admin/Staff phát hành)
builder.Services.AddScoped<IVoucherRepository, VoucherRepository>();
builder.Services.AddScoped<IVoucherService, VoucherService>();
// Khiếu nại / báo cáo người chơi
builder.Services.AddScoped<IReportRepository, ReportRepository>();
builder.Services.AddScoped<IReportService, ReportService>();
// Phê duyệt E-KYC (Admin)
builder.Services.AddScoped<IEkycRepository, EkycRepository>();
builder.Services.AddScoped<IEkycService, EkycService>();

// Player features roadmap
builder.Services.AddScoped<ISplitPaymentService, SplitPaymentService>();
builder.Services.AddScoped<IRecurringBookingService, RecurringBookingService>();
builder.Services.AddScoped<ICancellationPolicyService, CancellationPolicyService>();
builder.Services.AddScoped<IEloRatingService, EloRatingService>();
builder.Services.AddScoped<ITournamentService, TournamentService>();
builder.Services.AddScoped<IMembershipService, MembershipService>();
builder.Services.AddScoped<INotificationService, SignalRNotificationService>();
builder.Services.AddHostedService<PlayerFeaturesBackgroundService>();
builder.Services.AddSignalR();

// Configure Rate Limiting
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("OtpPolicy", opt =>
    {
        opt.PermitLimit = 5;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 0;
    });
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});

// Configure JWT Authentication — secret from env/config (never commit production keys)
const string JwtPlaceholder = "YOUR_JWT_SECRET_KEY_HERE_MIN_256_BITS";
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var jwtSecret = jwtSettings["SecretKey"]
    ?? Environment.GetEnvironmentVariable("JWT_SECRET_KEY");
if (string.IsNullOrWhiteSpace(jwtSecret) || jwtSecret == JwtPlaceholder)
{
    if (!builder.Environment.IsDevelopment())
        throw new InvalidOperationException(
            "JwtSettings:SecretKey or JWT_SECRET_KEY environment variable must be set in non-Development environments.");
    jwtSecret = "ProSport-Dev-Only-JWT-Secret-Key-256bits-DoNotUseInProduction!!";
}
if (jwtSecret.Length < 32)
    throw new InvalidOperationException("JWT secret must be at least 256 bits (32 characters).");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                    context.Token = accessToken;
                return Task.CompletedTask;
            }
        };
    });
builder.Services.AddAuthorization();

// Configure CORS — read allowed origins from config for multi-environment support (BUG-10 FIX)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            // Read origins from config: Cors:AllowedOrigins (array) or fallback to dev default
            var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                ?? new[] {
                    "http://localhost:5173",
                    "http://localhost:5174",
                    "http://127.0.0.1:5173",
                    "http://127.0.0.1:5174",
                };
            
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
// TK-039: chỉ bật Swagger ở môi trường Development, ẩn hoàn toàn ở Production.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles(); // Added for LocalStorageService

// app.UseHttpsRedirection(); // Disabled to avoid redirect issues

app.UseCors("AllowFrontend");

app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

// Apply migrations + idempotent seed (never wipe existing data on startup)
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ProSportDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    await DatabaseBootstrap.ApplyAsync(context, logger);
    await DatabaseSeeder.EnsureEquipmentRentalSchemaAsync(context);
    await DatabaseSeeder.SeedEquipmentAsync(context);
    await DatabaseSeeder.SeedCourtsAsync(context);
    await SampleUserSeeder.SeedAsync(context, scope.ServiceProvider.GetRequiredService<IConfiguration>(), app.Environment.IsDevelopment(), logger);
    await OwnerDemoSeeder.SeedAsync(context, logger);
    try
    {
        await StaffDemoSeeder.SeedAsync(context, logger);
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "[StaffDemoSeeder] Skipped demo seed due to error (non-fatal).");
    }
}

app.MapControllers();
app.MapHub<NotificationHub>("/hubs/notifications");

app.MapGet("/", () => "ProSport API is running. Go to /swagger to view the API documentation.");

app.Run();