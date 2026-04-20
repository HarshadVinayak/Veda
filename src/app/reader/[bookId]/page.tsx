import BetterReader from '@/components/reader/ReaderPage';

// Demo book content split into pages
const DEMO_PAGES = [
  `Chapter 1: The Nature of Learning

Learning is not a spectator sport. The more actively you engage with the material, the deeper your understanding becomes. When you read, don't just let the words wash over you. Instead, interrogate the text. Ask questions, draw connections, and highlight the passages that resonate with you.

The human brain is wired to forget. Within 24 hours, you lose roughly 70% of new information unless you actively work to retain it. This is known as the Ebbinghaus Forgetting Curve, and it has profound implications for how we should approach study.

Active recall — the process of actively stimulating memory during the learning process — is one of the most effective learning strategies ever discovered. Rather than passively re-reading your notes, try to recall them from memory. If you can't, that's actually a good sign: the struggle of retrieval strengthens the neural pathways.`,

  `Chapter 2: The Science of Memory

Memory isn't a single system — it's a collection of interrelated processes. Short-term memory holds about 7 items for roughly 20-30 seconds. Long-term memory, on the other hand, can store virtually unlimited information for a lifetime.

The key to converting short-term memories to long-term ones is a process called consolidation. During sleep, your brain replays the day's events, strengthening important connections and pruning away irrelevant ones.

Spaced repetition — reviewing material at gradually increasing intervals — is the most efficient way to commit information to long-term memory. Instead of cramming all at once, space your reviews over days, then weeks, then months.

Interleaving is another powerful technique. Rather than studying one subject intensively, mix different types of problems or topics within a single study session. This forces your brain to make connections between concepts.`,

  `Chapter 3: Deliberate Practice

Mastery requires patience and deliberate practice. It's not about how fast you can consume information, but rather how well you can synthesize it and apply it to novel situations.

Anders Ericsson, the psychologist behind the "10,000 hours" concept, emphasizes that not all practice is equal. Deliberate practice involves:

1. Working on specific weaknesses, not just doing what's comfortable.
2. Getting immediate feedback on your performance.
3. Pushing yourself just beyond your current ability level.
4. Having a clear mental model of what expert performance looks like.

The difference between amateurs and experts is often the quality of their practice, not merely the quantity. An amateur might play tennis for 10,000 hours and still be mediocre, while a focused practitioner might reach mastery in far less time.

The growth mindset — believing that abilities can be developed through effort — is crucial for maintaining motivation during the difficult early stages of skill acquisition.`,

  `Chapter 4: Building Study Systems

The most successful learners don't rely on willpower alone — they build systems. A good study system makes learning the default behavior, removing the need for constant decision-making.

Key principles for building study systems:

• Environment Design: Set up your workspace to minimize distractions. Keep books and notes visible. Remove your phone from the room.

• The Two-Minute Rule: If a study task takes less than two minutes, do it immediately. This prevents small tasks from piling up.

• Habit Stacking: Attach new study habits to existing routines. "After I pour my morning coffee, I will review flashcards for 10 minutes."

• The Pomodoro Technique: Work in 25-minute focused bursts with 5-minute breaks. After four cycles, take a longer 15-30 minute break.

Remember: the goal isn't to study more, but to study better. Quality always trumps quantity in learning.`,
];

export default function ReaderDemoPage() {
  return (
    <BetterReader
      bookId="demo-book-001"
      pages={DEMO_PAGES}
    />
  );
}
