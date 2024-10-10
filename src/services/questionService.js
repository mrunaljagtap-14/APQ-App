import api from '.ser/api';

export const fetchQuestions = () => {
  return api.get('/questions');
};

export const addQuestion = (data) => {
  return api.post('/questions', data);
};

export const updateQuestion = (id, data) => {
  return api.put(`/questions/${id}`, data);
};

export const toggleQuestionStatus = (id) => {
  return api.patch(`/questions/${id}/activate`);
};
