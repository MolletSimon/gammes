import React, { useState } from 'react';
import Quiz from './components/Quiz';

const App: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Quiz />
    </div>
  );
};

export default App;
