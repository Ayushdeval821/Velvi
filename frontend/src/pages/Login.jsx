import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AlertMessage from '../components/AlertMessage.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      // handled by context error
    }
  };

  return (
    <div className="container py-5 my-md-4">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card p-4 p-md-5 border-0 rounded-4 shadow-sm bg-white">
            <div className="text-center mb-4">
              <img src="/logo.svg" alt="VELVI NATURALS" width="56" height="56" className="mb-2" />
              <h2 className="fw-bold" style={{ color: 'var(--forest)' }}>Welcome Back</h2>
              <p className="text-muted small">Log in to manage your orders and profile</p>
            </div>

            {error && <AlertMessage variant="danger">{error}</AlertMessage>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-velvi w-100 py-2 mb-3"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Sign In'}
              </button>
            </form>

            <div className="text-center pt-3 border-top">
              <span className="text-muted small">Don't have an account yet? </span>
              <Link to="/register" className="fw-bold text-success text-decoration-none small">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
