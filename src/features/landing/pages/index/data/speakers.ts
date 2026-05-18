export interface Speaker {
  index: string
  name: string
  role: string
  bio: string
  avatar?: string
}

export const speakers: Speaker[] = [
  {
    index: 'DIỄN GIẢ 01',
    name: 'Võ Văn Hiếu',
    role: 'SWE · AXONACTIVE',
    bio: 'Engineer chuyên về AI-assisted workflow, đang dẫn dắt việc chuẩn hoá prompt convention cho team product.',
  },
  {
    index: 'DIỄN GIẢ 02',
    name: 'Đỗ Ngọc Quý',
    role: 'SWE · ENOSTA',
    bio: 'Coding agent enthusiast. Tập trung vào harness engineering — dựng chuồng để agent ship được lên prod an toàn.',
  },
  {
    index: 'DIỄN GIẢ 03',
    name: 'Cao Minh Đức',
    role: 'DevOps · AXONACTIVE',
    bio: 'DevOps lead. Pipeline từ idea tới deploy, vibe coding mà vẫn cầm trịch CI/CD.',
  },
]
