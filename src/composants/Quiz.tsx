import React, { useState, useEffect } from 'react';
import data from '../data.json';

interface Degrés {
  [key: string]: string;
}

interface Gamme {
  nom: string;
  degres: Degrés;
}

const Quiz: React.FC = () => {
  const [gamme, setGamme] = useState<Gamme | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [answer, setAnswer] = useState<string>('');
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    // Choisir une gamme au hasard et démarrer le quiz
    startQuiz();
  }, []);

  useEffect(() => {
    let timer: any;
    if (!isFinished) {
      timer = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isFinished]);

  const startQuiz = () => {
    const randomGamme = data.gammes[Math.floor(Math.random() * data.gammes.length)];
    setGamme(randomGamme);

    const degrees = Object.keys(randomGamme.degres);
    const shuffledDegrees = degrees.sort(() => 0.5 - Math.random()).slice(0, 5);
    setQuestions(shuffledDegrees);

    setStartTime(Date.now());
    setCurrentTime(Date.now());
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswer('');
    setFeedback(null);
    setIsFinished(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gamme) {
      const correctAnswer = gamme.degres[questions[currentQuestionIndex]];
      if (answer === correctAnswer) {
        setScore(score + 1);
        setFeedback('Bonne réponse!');
      } else {
        setFeedback(`Mauvaise réponse. La bonne réponse était ${correctAnswer}.`);
      }
      setAnswer('');
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setIsFinished(true);
      }
    }
  };

  const getElapsedTime = () => {
    return ((currentTime - startTime) / 1000).toFixed(0);
  };

  if (!gamme) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Quiz de Gamme Majeure</h1>
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <p className="text-lg mb-4">Gamme: <span className="font-semibold">{gamme.nom}</span></p>
        <p className="text-lg mb-4">Score: <span className="font-semibold">{score}</span></p>
        <p className="text-lg mb-4">Temps: <span className="font-semibold">{getElapsedTime()} secondes</span></p>
        {!isFinished ? (
          <form onSubmit={handleSubmit} className="flex flex-col">
            <p className="text-lg mb-4">Quel est le {questions[currentQuestionIndex]} degré ?</p>
            <input
              type="text"
              className="mb-4 p-2 border border-gray-300 rounded-md"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              Submit
            </button>
            {feedback && (
              <p className={`mt-4 text-lg ${feedback.includes('Bonne') ? 'text-green-500' : 'text-red-500'}`}>
                {feedback}
              </p>
            )}
          </form>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Quiz terminé!</h2>
            <p className="text-lg">Votre score est: <span className="font-semibold">{score} / {questions.length}</span></p>
            <p className="text-lg">Temps pris: <span className="font-semibold">{getElapsedTime()} secondes</span></p>
            <button
              onClick={startQuiz}
              className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
            >
              Essayer encore
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
