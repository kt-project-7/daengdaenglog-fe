export type Claim = {
  id: number | null
  date: string
  hospital: string
  description: string
  medicalFee: number
  claimAmount: number
  refundAmount: number
  status: string
}
