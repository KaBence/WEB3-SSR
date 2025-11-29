"use client"

import { useCallback, useState, type KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { player_slice } from '../../src/slices/player_slice';
import './Login.css';
import { useStoreDispatch } from '@/stores/store';

const Login = () => {
  const dispatch = useStoreDispatch();
  const router = useRouter();

  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(() => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter a name');
      return;
    }
    dispatch(player_slice.actions.login(trimmed));
    localStorage.setItem('uno.playerName', trimmed);
    router.push('/Lobby');
  }, [dispatch, name, router]);

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit();
  };

  return (
    <div className="login-root">
      <div className="login-card" role="main">
      

        <h2 className="login-title">Let's play UNO!</h2>
        <p className="login-subtitle">Pick a name and jump into the lobby.</p>

        <div className="login-form">
          <label className="login-label" htmlFor="player-name-input">
            Player name
          </label>
          <input
            aria-label="Player name"
            placeholder="Enter name"
            id="player-name-input"
            onKeyDown={onKey}
            className="login-input"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
          />
          {error && <div className="login-error" role="alert">{error}</div>}

          <button
            type="button"
            onClick={submit}
            className="login-button"
          >
            Create Player
          </button>

        
        </div>
      </div>
    </div>
  );
};

export default Login;
