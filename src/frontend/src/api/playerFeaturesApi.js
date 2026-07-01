import axiosClient from './axiosClient';

export const playerFeaturesApi = {
  createSplitBooking: (data) => axiosClient.post('/split-payments/bookings', data),
  paySplitShare: (bookingId) => axiosClient.post(`/split-payments/bookings/${bookingId}/pay`),
  getSplitShares: (bookingId) => axiosClient.get(`/split-payments/bookings/${bookingId}/shares`),

  createRecurringRule: (data) => axiosClient.post('/recurring-bookings', data),
  getMyRecurringRules: () => axiosClient.get('/recurring-bookings/my-rules'),
  cancelRecurringRule: (ruleId) => axiosClient.delete(`/recurring-bookings/${ruleId}`),

  getUserElo: (userId, sportType = 'Badminton') =>
    axiosClient.get(`/elo/users/${userId}`, { params: { sportType } }),
  submitMatchResult: (data) => axiosClient.post('/elo/match-results', data),
  confirmMatchResult: (matchId) => axiosClient.post(`/elo/match-results/${matchId}/confirm`),
  disputeMatchResult: (matchId) => axiosClient.post(`/elo/match-results/${matchId}/dispute`),

  getTournaments: (complexId) => axiosClient.get(`/tournaments/complex/${complexId}`),
  registerTournament: (tournamentId, teamName) =>
    axiosClient.post(`/tournaments/${tournamentId}/register`, { teamName }),

  getCancellationPolicy: (complexId) =>
    axiosClient.get(`/owner/complexes/${complexId}/cancellation-policy`),
  updateCancellationPolicy: (complexId, data) =>
    axiosClient.put(`/owner/complexes/${complexId}/cancellation-policy`, data),

  getMyMemberships: () => axiosClient.get('/memberships/me'),
};
