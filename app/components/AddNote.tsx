'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import isAuthenticated from '../utils/auth';

type Note = {
  id: number;
  note_text: string;
  created_at: string;
};

const AddNotePage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchNotes = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      // Check authentication status
      const auth = await isAuthenticated();
      if (!auth.isAuthenticated) {
        router.push('/login');
        return;
      }

      if (!userId || !token) {
        setError('You are not logged in or your session has expired. Please log in again.');
        router.push('/login');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/patients/${userId}/notes`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setNotes(response.data);
      } catch (err: any) {
        console.error('Error fetching notes:', err);
        setError('Failed to fetch notes');
      }
    };

    fetchNotes();
  }, [router]);

  const handleAddNote = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    // Check authentication status
    const auth = await isAuthenticated();
    if (!auth.isAuthenticated) {
      router.push('/login');
      return;
    }

  

    if (!newNote.trim()) {
      setError('Note content cannot be empty.');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/patients/addnotes/${userId}`,
        { note_text: newNote },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setNotes([...notes, response.data]);
      setNewNote('');
      setError('');
    } catch (err: any) {
      console.error('Error adding note:', err);
      setError('Failed to add note');
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    const token = localStorage.getItem('token');

    try {
      await axios.delete(`http://localhost:3000/patients/deletenote/${noteId}`, {
        
        withCredentials: true,
      });
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (err: any) {
      console.error('Error deleting note:', err);
      setError('Failed to delete note');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Personal Notes</h1>
    <div className="mb-4 w-3/5 mx-auto"> {/* Adjusted width and centering */}
      <textarea 
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Enter a new note"
        className="border p-2 rounded-md w-full"
      />
      <button
        onClick={handleAddNote}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 " 
      >
        Add Note
      </button>
    </div>
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      {notes.length > 0 ? (
        <div className="w-3/5 mx-auto bg-white p-4 rounded-md shadow-md">
          <ul className="list-decimal pl-5">
            {notes.map((note, index) => (
              <li key={note.id} className="mb-2">
                <p><strong>Note {index + 1}:</strong> {note.note_text}</p>
                <p><strong>Date:</strong> {new Date(note.created_at).toLocaleString()}</p>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mt-2"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default AddNotePage;
