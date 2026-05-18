export interface Takeaway {
  index: string
  title: string
  description: string
}

export const takeaways: Takeaway[] = [
  {
    index: '01',
    title: 'Standardizing AI-Assisted Dev',
    description: 'Convention, review rule, guardrail — để team không mỗi người một kiểu prompt.',
  },
  {
    index: '02',
    title: 'Harness Engineering for Agents',
    description: 'Dựng chuồng cho coding agent. Mạnh nhưng không vượt rào, an toàn lên prod.',
  },
  {
    index: '03',
    title: 'Vibe Coding: Idea → Deployment',
    description: 'Idea sáng. Prompt trưa. Deploy chiều. Pipeline thật, không demo.',
  },
]
