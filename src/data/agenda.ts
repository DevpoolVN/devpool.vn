export interface AgendaItem {
  time: string
  duration: string
  title: string
  tag?: string
  tagVariant?: 'default' | 'yellow'
  description: string
  by?: string
}

export const agenda: AgendaItem[] = [
  {
    time: '14:00',
    duration: '10 PHÚT',
    title: 'CHECK-IN & OPENING',
    tag: 'OPEN',
    description: 'Vào phòng, nhận tag, tìm chỗ. Đến đúng giờ giúp BTC đỡ stress.',
    by: 'BY · BAN TỔ CHỨC',
  },
  {
    time: '14:10',
    duration: '30 PHÚT',
    title: 'Standardizing AI-Assisted Development',
    tag: 'TALK 01',
    tagVariant: 'yellow',
    description: 'Convention, review rule, guardrail. Để code cùng AI mà team vẫn nhất quán.',
    by: 'BY · VÕ VĂN HIẾU',
  },
  {
    time: '14:40',
    duration: '30 PHÚT',
    title: 'Harness Engineering for Coding Agents',
    tag: 'TALK 02',
    tagVariant: 'yellow',
    description: 'Dựng chuồng cho coding agent. Mạnh nhưng không vượt rào, ship được lên prod.',
    by: 'BY · ĐỖ NGỌC QUÝ',
  },
  {
    time: '15:10',
    duration: '30 PHÚT',
    title: 'Vibe Coding: From Idea to Deployment',
    tag: 'TALK 03',
    tagVariant: 'yellow',
    description: 'Idea sáng → prompt trưa → deploy chiều. Pipeline thật, không slide demo.',
    by: 'BY · CAO MINH ĐỨC',
  },
  {
    time: '15:40',
    duration: '15 PHÚT',
    title: 'Q&A & PANEL',
    tag: 'LIVE',
    description: '3 speaker lên ghế nóng. Câu hỏi gửi trước qua form được đọc ưu tiên.',
    by: 'BY · TẤT CẢ DIỄN GIẢ',
  },
  {
    time: '15:55',
    duration: '5 PHÚT',
    title: 'CLOSING & GROUP PHOTO',
    description: 'Cảm ơn, group photo, hashtag, về. Hẹn số sau.',
    by: 'BY · BAN TỔ CHỨC',
  },
]
