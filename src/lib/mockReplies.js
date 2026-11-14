import { quickAnswer } from './quickAnswer.js'

const CANNED = [
  [/study plan|finals|exam/i, "Sure. Tell me which classes you have, when your exams are, and how many hours a day you can study, and I'll build a week-by-week plan.\n\nTo start: split each day into three focused blocks (one per subject), rotate the hardest subject into your freshest hour, and leave the last two days before each exam for practice tests only."],
  [/cover letter/i, "Happy to help. Paste the job description and a few lines about your experience, and I'll draft a one-page cover letter that leads with your strongest match to the role."],
  [/photosynthesis/i, 'Photosynthesis is how plants turn light into food: chlorophyll captures sunlight, which powers the conversion of carbon dioxide and water into glucose, releasing oxygen as a by-product.'],
  [/trip|weekend|travel/i, 'Here are three weekend ideas: a cabin with hiking trails within 2 hours of home, a food-focused city trip with a walking tour, or a lake day with a picnic and kayak rental. Want me to price one out?'],
]

export function mockReply(prompt) {
  for (const [re, reply] of CANNED) if (re.test(prompt)) return reply
  const quick = quickAnswer(prompt)
  if (quick) return `The answer is ${quick}.`
  return "Good question. Here's a quick take: break it into the smallest next step, try it, and adjust. If you share a bit more detail, I can give you something more specific."
}
