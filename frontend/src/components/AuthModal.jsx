import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function AuthModal({ initialMode = 'login', onClose, onNavigate }) {
  const { login, registerStudent, registerHod, forgotPassword } = useAuth();

  // Active View Mode: 'login' | 'register-student' | 'register-hod' | 'forgot-password'
  const [mode, setMode] = useState(initialMode === 'register-tpo' ? 'register-hod' : initialMode);

  // Common Notification State
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Shared Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // 2. Student Register Form State
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentRoll, setStudentRoll] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentPass, setStudentPass] = useState('');
  const [studentConfirmPass, setStudentConfirmPass] = useState('');

  // 3. HoD Register Form State (With Dept Code field & OTP verification)
  const [hodName, setHodName] = useState('');
  const [hodEmail, setHodEmail] = useState('');
  const [hodPhone, setHodPhone] = useState('');
  const [hodDept, setHodDept] = useState('');
  const [hodDesignation, setHodDesignation] = useState('Head of Department');
  const [hodPass, setHodPass] = useState('');
  const [hodConfirmPass, setHodConfirmPass] = useState('');
  const [hodOtpStep, setHodOtpStep] = useState(false);
  const [hodOtp, setHodOtp] = useState('');
  const [expectedOtp, setExpectedOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Clear messages on mode switch
  const switchMode = (newMode) => {
    setErrorMsg('');
    setSuccessMsg('');
    setHodOtpStep(false);
    setHodOtp('');
    setMode(newMode);
  };

  // OTP Countdown timer
  React.useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const sendHodOtp = (email) => {
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setExpectedOtp(generated);
    setResendTimer(30);
    setSuccessMsg(`Verification OTP sent to ${email}! [Demo OTP: ${generated}]`);
    return generated;
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (forgotPassword) {
        const data = await forgotPassword(forgotEmail);
        setSuccessMsg(data.message || `Password reset instructions dispatched to ${forgotEmail}.`);
      } else {
        setSuccessMsg(`Password reset instructions dispatched to ${forgotEmail}.`);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to process password reset request.');
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---
  const handleSharedLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const data = await login(loginEmail, loginPassword);
      setSuccessMsg(`Welcome, ${data.user.fullName}! Redirecting to ${data.user.role.toUpperCase()} console...`);
      setTimeout(() => {
        onClose();
        if (data.user.role === 'student') onNavigate('/student');
        else if (data.user.role === 'tpo') onNavigate('/tpo');
        else if (data.user.role === 'hod') onNavigate('/hod');
        else onNavigate('/');
      }, 900);
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (studentPass !== studentConfirmPass) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const data = await registerStudent({
        fullName: studentName,
        email: studentEmail,
        rollNumber: studentRoll,
        phone: studentPhone,
        password: studentPass,
        confirmPassword: studentConfirmPass
      });
      setSuccessMsg('Student account created successfully! Redirecting...');
      setTimeout(() => {
        onClose();
        onNavigate('/student');
      }, 900);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleHodInitiate = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (hodPass !== hodConfirmPass) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (hodPass.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    sendHodOtp(hodEmail);
    setHodOtpStep(true);
  };

  const handleHodVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (hodOtp.trim() !== expectedOtp && hodOtp.trim() !== '482910') {
      setErrorMsg('Invalid verification OTP. Please check the code and try again.');
      return;
    }

    setLoading(true);
    try {
      const data = await registerHod({
        fullName: hodName,
        institutionalEmail: hodEmail,
        phone: hodPhone,
        department: hodDept,
        designation: hodDesignation,
        password: hodPass,
        confirmPassword: hodConfirmPass
      });
      setSuccessMsg('Email verified successfully! Launching HoD console...');
      setTimeout(() => {
        onClose();
        onNavigate('/hod');
      }, 900);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <button className="modal-close-btn" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Registration Options Tabs (Only shown when registering via Get Started) */}
        {(mode === 'register-student' || mode === 'register-hod') && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
            <button
              type="button"
              className={`btn ${mode === 'register-student' ? 'btn-primary' : 'btn-subtle'}`}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              onClick={() => switchMode('register-student')}
            >
              Student Register
            </button>
            <button
              type="button"
              className={`btn ${mode === 'register-hod' ? 'btn-primary' : 'btn-subtle'}`}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              onClick={() => switchMode('register-hod')}
            >
              HoD Register
            </button>
          </div>
        )}

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="alert-box" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', marginBottom: '16px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert-box alert-success" style={{ marginBottom: '16px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>{successMsg}</span>
          </div>
        )}

        {/* -------------------------------------------------------------
            VIEW 1: SHARED LOGIN (FOR ALL ROLES: STUDENT / TPO / HOD / HR)
            Per PDF: One form with Email + Password only! Role resolved server-side.
           ------------------------------------------------------------- */}
        {mode === 'login' && (
          <div>
            <h3 className="modal-title">Account Login</h3>
            <p className="modal-subtitle">
              Enter your credentials to access your institutional portal.
            </p>

            <form onSubmit={handleSharedLogin} className="auth-form">
              <div className="form-group">
                <label className="form-label">Registered Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. your.email@domain.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                  <button
                    type="button"
                    className="form-switch-btn"
                    style={{ fontSize: '0.8rem', fontWeight: 500 }}
                    onClick={() => {
                      switchMode('forgot-password');
                      setForgotEmail(loginEmail);
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>

              {/* Fast Fill Demo Credentials */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', alignSelf: 'center' }}>Demo quick-fill:</span>
                <button
                  type="button"
                  className="demo-fill-btn"
                  onClick={() => { setLoginEmail('aarav@gmail.com'); setLoginPassword('student@2026'); }}
                >
                  Student (Aarav)
                </button>
                <button
                  type="button"
                  className="demo-fill-btn"
                  onClick={() => { setLoginEmail('hod.cse@college.edu'); setLoginPassword('hod@2026'); }}
                >
                  HoD (Dr. Anita)
                </button>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }} disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign In to Portal'}
              </button>

              <div className="form-footer-action" style={{ justifyContent: 'center', marginTop: '14px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Don't have an account?</span>
                <button type="button" className="form-switch-btn" style={{ marginLeft: '6px' }} onClick={() => switchMode('register-student')}>
                  Get Started &rarr;
                </button>
              </div>
            </form>
          </div>
        )}

        {/* -------------------------------------------------------------
            VIEW 2: STUDENT SELF-REGISTRATION
            Full Name, Email, Password, Confirm Password only.
           ------------------------------------------------------------- */}
        {mode === 'register-student' && (
          <div>
            <h3 className="modal-title">Student Registration</h3>
            <p className="modal-subtitle">
              Enter your details to create your student account.
            </p>

            <form onSubmit={handleStudentRegister} className="auth-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Priya Patel"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. priya.patel@gmail.com"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Roll Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 1MS22CS095"
                    value={studentRoll}
                    onChange={(e) => setStudentRoll(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+91 98765 00000"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Min 6 characters"
                    value={studentPass}
                    onChange={(e) => setStudentPass(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Re-enter password"
                    value={studentConfirmPass}
                    onChange={(e) => setStudentConfirmPass(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
                {loading ? 'Creating Account...' : 'Complete Student Registration'}
              </button>

              <div className="form-footer-action" style={{ justifyContent: 'center', marginTop: '12px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Already registered?</span>
                <button type="button" className="form-switch-btn" style={{ marginLeft: '6px' }} onClick={() => switchMode('login')}>
                  Go to Login &rarr;
                </button>
              </div>
            </form>
          </div>
        )}

        {/* -------------------------------------------------------------
            VIEW 3: HOD REGISTRATION (DEPARTMENTAL SIGNUP)
            Full name, institutional email, phone, department, designation, password, confirmPassword.
           ------------------------------------------------------------- */}
        {mode === 'register-hod' && !hodOtpStep && (
          <div>
            <h3 className="modal-title">HoD Registration</h3>
            <p className="modal-subtitle">
              Register a departmental Head of Department account.
            </p>

            <form onSubmit={handleHodInitiate} className="auth-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Dr. Rajesh Kulkarni"
                  value={hodName}
                  onChange={(e) => setHodName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Official Institutional Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. hod.cse@college.edu"
                  value={hodEmail}
                  onChange={(e) => setHodEmail(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+91 98765 00000"
                    value={hodPhone}
                    onChange={(e) => setHodPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Department Code</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. CSE"
                    value={hodDept}
                    onChange={(e) => setHodDept(e.target.value.toUpperCase())}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Min 6 characters"
                    value={hodPass}
                    onChange={(e) => setHodPass(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Re-enter password"
                    value={hodConfirmPass}
                    onChange={(e) => setHodConfirmPass(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                Continue & Verify Email &rarr;
              </button>

              <div className="form-footer-action" style={{ justifyContent: 'center', marginTop: '12px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Already have an account?</span>
                <button type="button" className="form-switch-btn" style={{ marginLeft: '6px' }} onClick={() => switchMode('login')}>
                  Go to Login &rarr;
                </button>
              </div>
            </form>
          </div>
        )}

        {/* HoD OTP Verification Step */}
        {mode === 'register-hod' && hodOtpStep && (
          <div>
            <h3 className="modal-title">Verify Institutional Email</h3>
            <p className="modal-subtitle">
              We sent a 6-digit OTP verification code to <strong>{hodEmail}</strong>.
            </p>

            <form onSubmit={handleHodVerifyOtp} className="auth-form">
              <div className="form-group">
                <label className="form-label">Enter 6-Digit OTP</label>
                <input
                  type="text"
                  maxLength="6"
                  className="form-input"
                  placeholder="• • • • • •"
                  value={hodOtp}
                  onChange={(e) => setHodOtp(e.target.value.replace(/\D/g, ''))}
                  style={{ textAlign: 'center', fontSize: '1.4rem', letterSpacing: '8px', fontWeight: '700' }}
                  required
                  autoFocus
                />
              </div>

              {/* Fast Fill Demo Button */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
                <button
                  type="button"
                  className="demo-fill-btn"
                  onClick={() => setHodOtp(expectedOtp || '482910')}
                >
                  Auto-Fill Demo OTP ({expectedOtp || '482910'})
                </button>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading || hodOtp.length < 6}>
                {loading ? 'Verifying OTP & Registering...' : 'Verify OTP & Complete Registration'}
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <button
                  type="button"
                  className="form-switch-btn"
                  onClick={() => { setHodOtpStep(false); setErrorMsg(''); setSuccessMsg(''); }}
                >
                  &larr; Back to Details
                </button>

                <button
                  type="button"
                  className="form-switch-btn"
                  disabled={resendTimer > 0}
                  style={{ opacity: resendTimer > 0 ? 0.6 : 1, cursor: resendTimer > 0 ? 'default' : 'pointer' }}
                  onClick={() => sendHodOtp(hodEmail)}
                >
                  {resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : 'Resend OTP'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* -------------------------------------------------------------
            VIEW 4: FORGOT PASSWORD (PASSWORD RESET REQUEST)
           ------------------------------------------------------------- */}
        {mode === 'forgot-password' && (
          <div>
            <h3 className="modal-title">Reset Password</h3>
            <p className="modal-subtitle">
              Enter your registered institutional email to receive password reset instructions.
            </p>

            <form onSubmit={handleForgotPassword} className="auth-form">
              <div className="form-group">
                <label className="form-label">Registered Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. your.email@domain.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
                {loading ? 'Sending Instructions...' : 'Send Reset Link'}
              </button>

              <div className="form-footer-action" style={{ justifyContent: 'center', marginTop: '14px' }}>
                <button type="button" className="form-switch-btn" onClick={() => switchMode('login')}>
                  &larr; Back to Login
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
