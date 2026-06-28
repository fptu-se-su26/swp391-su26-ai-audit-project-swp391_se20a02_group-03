import { Link } from 'react-router-dom'
import MobileLayout from '../../layouts/MobileLayout'
import EmptyState from '../../components/ui/EmptyState'
import { MessageSquare } from 'lucide-react'

export default function MobileChatPage() {
  return (
    <MobileLayout hideBottomNav title="Tin nhắn">
      <div className="font-sans -mx-4 -my-5 pb-24 min-h-[60vh] flex flex-col">
        <EmptyState
          icon={<MessageSquare size={28} />}
          title="Chưa có cuộc trò chuyện"
          subtitle="Tham gia một kèo đấu để bắt đầu trò chuyện với đồng đội."
          action={
            <Link to="/mobile/matches" className="btn-primary no-underline text-sm px-6 py-2.5">
              Xem kèo đang mở
            </Link>
          }
        />
      </div>
    </MobileLayout>
  )
}
