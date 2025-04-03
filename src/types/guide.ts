export interface Guide {
  guideId: number
  petName: string
  status: string
  guideType: string // '기본', '펫시터', '수의사', '유치원'
  createdDate: string
}

export interface GuideDetail {
  guideId: number
  guideType: string
  createdDate: string
  content?: string
  petName: string
}

export interface GuideRequest {
  guideType: 'HOSPITAL' | 'SITTER' | 'KINDERGARTEN' | 'NONE'
  description: string
}
