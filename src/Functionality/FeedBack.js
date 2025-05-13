// src/Functionality/FeedBack.js

// LocalStorage functions
const STORAGE_KEY = 'feedback-tickets'

export const saveToLocalStorage = (tickets) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
}

export const loadFromLocalStorage = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      // Convert string dates back to Date objects
      const parsedTickets = JSON.parse(stored)
      return parsedTickets.map(ticket => ({
        ...ticket,
        createdAt: new Date(ticket.createdAt)
      }))
    } catch (e) {
      console.error('Error parsing tickets from localStorage', e)
      return []
    }
  }
  return [] // Make sure this return statement is added
}

export const clearAllTickets = () => {
  localStorage.removeItem(STORAGE_KEY)
  return []
}
