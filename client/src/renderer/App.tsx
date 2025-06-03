import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Login } from './pages/Login';
import { ThemeProvider } from './components/ThemeProvider';
import { Layout } from './components/Layout';
import  Recharge  from './pages/recharge/page';
import  Food  from './pages/food/page';
import  Reserve  from './pages/reserve/page';
import  Tournaments  from './pages/tournaments/page';
import  Rewards  from './pages/rewards/page';
import  Machine  from './pages/machine/page';
import  Profile  from './pages/profile/page';
import  Chat  from './pages/chat/page';
export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="theme">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={
            <Layout>
              <Dashboard />
            </Layout>
          } />
          <Route path="/recharge" element={
            <Layout>
              <Recharge />
            </Layout>
          } />
          <Route path="/food" element={
            <Layout>
             <Food />
            </Layout>
          } />
          <Route path="/reserve" element={
            <Layout>
             <Reserve />
            </Layout>
          } />
          <Route path="/tournaments" element={
            <Layout>
             <Tournaments />
            </Layout>
          } />
          <Route path="/rewards" element={
            <Layout>
             <Rewards />
            </Layout>
          } />
          <Route path="/machine" element={
            <Layout>
             <Machine />
            </Layout>
          } />
          <Route path="/profile" element={
            <Layout>
             <Profile />
            </Layout>
          } />
          <Route path="/chat" element={
            <Layout>
             <Chat />
            </Layout>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
} 