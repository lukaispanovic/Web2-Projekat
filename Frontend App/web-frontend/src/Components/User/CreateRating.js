import React, { useState } from 'react';

const CreateRating = ({ onSubmitRating }) => {
  const [rating, setRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitRating(rating);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Rate your driver:
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          min="1"
          max="5"
          required
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default CreateRating;




