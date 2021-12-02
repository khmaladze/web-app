import React from "react";

const localQuotes = [
  {
    text: "Genius is one percent inspiration and ninety-nine percent perspiration.",
    author: "Thomas Edison",
  },
  {
    text: "Well begun is half done.",
    author: "Aristotle",
  },
  {
    text: "Life is a learning experience, only if you learn.",
    author: "Yogi Berra",
  },
  {
    text: "Self-complacency is fatal to progress.",
    author: "Margaret Sangster",
  },
  {
    text: "Peace comes from within. Do not seek it without.",
    author: "Buddha",
  },
  {
    text: "What you give is what you get.",
    author: "Byron Pulsifer",
  },
  {
    text: "We can only learn to love by loving.",
    author: "Iris Murdoch",
  },
  {
    text: "Life is change. Growth is optional. Choose wisely.",
    author: "Karen Clark",
  },
  {
    text: "You'll see it when you believe it.",
    author: "Wayne Dyer",
  },
  {
    text: "Today is the tomorrow we worried about yesterday.",
    author: null,
  },
  {
    text: "It's easier to see the mistakes on someone else's paper.",
    author: null,
  },
  {
    text: "Every man dies. Not every man really lives.",
    author: null,
  },
  {
    text: "To lead people walk behind them.",
    author: "Lao Tzu",
  },
  {
    text: "Having nothing, nothing can he lose.",
    author: "William Shakespeare",
  },
  {
    text: "Trouble is only opportunity in work clothes.",
    author: "Henry J. Kaiser",
  },
  {
    text: "A rolling stone gathers no moss.",
    author: "Publilius Syrus",
  },
  {
    text: "Ideas are the beginning points of all fortunes.",
    author: "Napoleon Hill",
  },
  {
    text: "Doing nothing is better than being busy doing nothing.",
    author: "Lao Tzu",
  },
  {
    text: "Trust yourself. You know more than you think you do.",
    author: "Benjamin Spock",
  },
  {
    text: "Study the past, if you would divine the future.",
    author: "Confucius",
  },
  {
    text: "Luck is what happens when preparation meets opportunity.",
    author: "Seneca",
  },
  {
    text: "Victory belongs to the most persevering.",
    author: "Napoleon Bonaparte",
  },
  {
    text: "Love all, trust a few, do wrong to none.",
    author: "William Shakespeare",
  },
  {
    text: "In order to win, you must expect to win.",
    author: "Richard Bach",
  },
  {
    text: "A goal is a dream with a deadline.",
    author: "Napoleon Hill",
  },
  {
    text: "You can do it if you believe you can!",
    author: "Napoleon Hill",
  },
  {
    text: "Set your goals high, and don't stop till you get there.",
    author: "Bo Jackson",
  },
  {
    text: "Every new day is another chance to change your life.",
    author: null,
  },
  {
    text: "Smile, breathe, and go slowly.",
    author: "Thich Nhat Hanh",
  },
  {
    text: "Nobody will believe in you unless you believe in yourself.",
    author: "Liberace",
  },
  {
    text: "Do more than dream: work.",
    author: "William Arthur Ward",
  },
  {
    text: "No man was ever wise by chance.",
    author: "Seneca",
  },
  {
    text: "Some pursue happiness, others create it.",
    author: null,
  },
  {
    text: "He that is giddy thinks the world turns round.",
    author: "William Shakespeare",
  },
  {
    text: "Don't ruin the present with the ruined past.",
    author: "Ellen Gilchrist",
  },
  {
    text: "Do something wonderful, people may imitate it.",
    author: "Albert Schweitzer",
  },
  {
    text: "We do what we do because we believe.",
    author: null,
  },
  {
    text: "Do one thing every day that scares you.",
    author: "Eleanor Roosevelt",
  },
  {
    text: "If you cannot be silent be brilliant and thoughtful.",
    author: "Byron Pulsifer",
  },
  {
    text: "Who looks outside, dreams; who looks inside, awakes.",
    author: "Carl Jung",
  },
  {
    text: "What we think, we become.",
    author: "Buddha",
  },
  {
    text: "The shortest answer is doing.",
    author: "Lord Herbert",
  },
  {
    text: "All our knowledge has its origins in our perceptions.",
    author: "Leonardo da Vinci",
  },
  {
    text: "The harder you fall, the higher you bounce.",
    author: null,
  },
  {
    text: "Trusting our intuition often saves us from disaster.",
    author: "Anne Wilson Schaef",
  },
  {
    text: "Truth is powerful and it prevails.",
    author: "Sojourner Truth",
  },
  {
    text: "Light tomorrow with today!",
    author: "Elizabeth Browning",
  },
  {
    text: "Silence is a fence around wisdom.",
    author: "German proverb",
  },
  {
    text: "Society develops wit, but its contemplation alone forms genius.",
    author: "Madame de Stael",
  },
  {
    text: "The simplest things are often the truest.",
    author: "Richard Bach",
  },
  {
    text: "Everyone smiles in the same language.",
    author: null,
  },
  {
    text: "Yesterday I dared to struggle. Today I dare to win.",
    author: "Bernadette Devlin",
  },
  {
    text: "No alibi will save you from accepting the responsibility.",
    author: "Napoleon Hill",
  },
  {
    text: "If you can dream it, you can do it.",
    author: "Walt Disney",
  },
  {
    text: "It is better to travel well than to arrive.",
    author: "Buddha",
  },
  {
    text: "Life shrinks or expands in proportion to one's courage.",
    author: "Anais Nin",
  },
  {
    text: "You have to believe in yourself.",
    author: "Sun Tzu",
  },
  {
    text: "Our intention creates our reality.",
    author: "Wayne Dyer",
  },
  {
    text: "Silence is a true friend who never betrays.",
    author: "Confucius",
  },
  {
    text: "Character develops itself in the stream of life.",
    author: "Johann Wolfgang von Goethe",
  },
  {
    text: "From little acorns mighty oaks do grow.",
    author: "American proverb",
  },
  {
    text: "You can't stop the waves, but you can learn to surf.",
    author: "Jon Kabat-Zinn",
  },
  {
    text: "Reality does not conform to the ideal, but confirms it.",
    author: "Gustave Flaubert",
  },
  {
    text: "Speak low, if you speak love.",
    author: "William Shakespeare",
  },
  {
    text: "A really great talent finds its happiness in execution.",
    author: "Johann Wolfgang von Goethe",
  },
  {
    text: "Reality leaves a lot to the imagination.",
    author: "John Lennon",
  },
];

const LocalQuote = () => {
  const quote = localQuotes[Math.floor(Math.random() * localQuotes.length)];
  return (
    <div
      className="profile__post__card"
      style={{
        width: "90%",
        margin: "0 auto",
        marginTop: "35px",
        marginBottom: "35px",
        textAlign: "center",
      }}
    >
      <div className="profile__post__card__content">
        <div className="profile__post__card__content__text">
          <h5>{quote ? <h2>Quote:</h2> : "0"}</h5>
          {quote ? <h2>"{quote.text}"</h2> : "0"}
          {quote.author ? <h3>-- {quote.author}</h3> : <h3>"Unknown"</h3>}
        </div>
      </div>
    </div>
  );
};

export default LocalQuote;
