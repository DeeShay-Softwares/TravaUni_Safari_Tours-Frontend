// pages/AdminDashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, AppBar, Toolbar, Typography, Button, Paper, List, ListItemButton,
  ListItemIcon, ListItemText, IconButton, Menu, MenuItem, Drawer, Divider,
  Snackbar, Alert,
} from '@mui/material';
import {
  FiHome, FiLogOut, FiUsers, FiMessageSquare, FiBell, FiChevronDown,
  FiMenu, FiPackage, FiPlus,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { DashboardTab }     from './adminTabs/dashboardTab';
import { TripsTab }         from './adminTabs/tripsTab';
import { UpdatesTab }       from './adminTabs/updatesTab';
import { RegistrationsTab } from './adminTabs/registrationsTab';
import { TravelersTab }     from './adminTabs/travelersTab';

import TripDetailsPanel          from '@/components/TripDetailsPanel';
import RegistrationDetailsModal  from '@/components/RegistrationDetailsModal';
import { AdminDashboardProfile } from '@/components/AdminDashboardProfile';

import { useAuth }       from '@/context/AuthContext';
import AdminDashboardApi from '@/ApiCalls/AdminDashboardApi';
import AuthServices      from '@/ApiCalls/AdminAuth';
import TripServices      from '@/ApiCalls/TripApi';

import { colors }        from '@/assets/constants/theme';
import type { TripInput, TripUpdate, Registration, SnackbarState } from '@/types';

// ── Tab ids ───────────────────────────────────────────────────────────────────

const TABS = [
  { id: 0, label: 'Dashboard',     icon: <FiHome /> },
  { id: 1, label: 'Trips',         icon: <FiPackage /> },
  { id: 2, label: 'Updates',       icon: <FiMessageSquare /> },
  { id: 3, label: 'Registrations', icon: <FiUsers /> },
  { id: 4, label: 'Travelers',     icon: <FiUsers /> },
] as const;

// ── Component ─────────────────────────────────────────────────────────────────

const AdminDashboard: React.FC = () => {
  const navigate        = useNavigate();
  const { token, user } = useAuth();

  // ── State ─────────────────────────────────────────────────────────────────
  const [trips,        setTrips]       = useState<TripInput[]>([]);
  const [tripsLoading, setTripsLoading] = useState(true);
  const [tripUpdates,  setTripUpdates] = useState<TripUpdate[]>([
    {
      id: '1', tripId: '1',
      title:     'Tour Guide Assigned',
      content:   'Your guide has been confirmed.',
      date:      '2024-02-01',
      important: true,
      sentTo:    'both',
    },
  ]);

  // RegistrationsTab is now self-contained and fetches its own data,
  // so registrations state and handleConfirmRegistration are removed here.

  const [activeTab,       setActiveTab]       = useState(0);
  const [selectedTrip,    setSelectedTrip]    = useState<TripInput | null>(null);
  const [showTripDetails, setShowTripDetails] = useState(false);
  const [selectedReg,     setSelectedReg]     = useState<Registration | null>(null);
  const [showRegDetails,  setShowRegDetails]  = useState(false);
  const [anchorEl,        setAnchorEl]        = useState<null | HTMLElement>(null);
  const [drawerOpen,      setDrawerOpen]      = useState(false);
  const [snackbar,        setSnackbar]        = useState<SnackbarState>({
    open: false, message: '', severity: 'success',
  });

  // ── Data fetching ─────────────────────────────────────────────────────────
  const fetchTrips = useCallback(async () => {
    setTripsLoading(true);
    try {
      const res = await TripServices.getAllTrips();
      setTrips(res.data.data);
    } catch {
      showSnackbar('Failed to load trips', 'error');
    } finally {
      setTripsLoading(false);
    }
  }, []);

  useEffect(() => { fetchTrips(); }, [fetchTrips]);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      AdminDashboardApi.getDashboardData(),
      AdminDashboardApi.getProfile(),
    ]).catch(() => showSnackbar('Failed to fetch dashboard data', 'error'));
  }, [token]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const showSnackbar = (message: string, severity: SnackbarState['severity']) =>
    setSnackbar({ open: true, message, severity });

  const handleAddUpdate = (update: Omit<TripUpdate, 'id' | 'date'>) => {
    setTripUpdates((prev) => [
      { ...update, id: Date.now().toString(), date: new Date().toISOString() },
      ...prev,
    ]);
    showSnackbar('Update published successfully!', 'success');
  };

  const handleLogout = async () => {
    try {
      const stored = localStorage.getItem('token');
      localStorage.removeItem('token');
      if (stored) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${stored}`;
        const userStr = localStorage.getItem('user');
        localStorage.removeItem('user');
        const u = userStr ? JSON.parse(userStr) : null;
        await AuthServices.logout(u);
        showSnackbar('Logged out successfully', 'success');
      }
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      navigate('/', { replace: true });
    }
  };

  // ── Sidebar nav ───────────────────────────────────────────────────────────
  const NavList = ({ onSelect }: { onSelect?: () => void }) => (
    <List sx={{ p: 2 }}>
      {TABS.map((tab) => (
        <ListItemButton
          key={tab.id}
          selected={activeTab === tab.id}
          onClick={() => { setActiveTab(tab.id); onSelect?.(); }}
          sx={{
            mb: 1,
            borderRadius: 2,
            '&.Mui-selected': {
              bgcolor:   `${colors.oliveWood[500]}15`,
              color:     colors.oliveWood[700],
              '&:hover': { bgcolor: `${colors.oliveWood[500]}25` },
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{tab.icon}</ListItemIcon>
          <ListItemText primary={tab.label} primaryTypographyProps={{ fontWeight: 600 }} />
        </ListItemButton>
      ))}
    </List>
  );

  // ── Content router ────────────────────────────────────────────────────────
  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <DashboardTab
            trips={trips}
            registrations={[]}          // RegistrationsTab owns real data now
            onGoToTrips={() => setActiveTab(1)}
            onGoToUpdates={() => setActiveTab(2)}
            onGoToRegs={() => setActiveTab(3)}
          />
        );

      case 1:
        return (
          <TripsTab
            trips={trips}
            loading={tripsLoading}
            onRefresh={fetchTrips}
            showSnackbar={showSnackbar}
            onTripClick={(trip) => {
              setSelectedTrip(trip);
              setShowTripDetails(true);
            }}
          />
        );

      case 2:
        return (
          <UpdatesTab
            trips={trips}
            tripUpdates={tripUpdates}
            onAddUpdate={handleAddUpdate}
          />
        );

      case 3:
        // RegistrationsTab fetches its own bookings from the API.
        // We only pass trips (for the filter dropdown) and showSnackbar.
        return (
          <RegistrationsTab
            trips={trips}
            showSnackbar={showSnackbar}
          />
        );

      case 4:
        return <TravelersTab showSnackbar={showSnackbar} />;

      default:
        return null;
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>

      {/* ── Desktop sidebar ─────────────────────────────────────────────── */}
      <Paper
        sx={{
          width:         280,
          flexShrink:    0,
          display:       { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          borderRadius:  0,
          borderRight:   `1px solid ${colors.darkKhakhi[200]}`,
        }}
      >
        <AdminDashboardProfile
          avatar="/public/pictures/pic4.jpeg"
          status={user?.status || ''}
          name={user?.name     || ''}
        />

        <Box sx={{ p: 3, borderBottom: `1px solid ${colors.darkKhakhi[200]}` }}>
          <Typography variant="h5" fontWeight={800} color={colors.oliveWood[700]}>
            TRAVAUNI ADMIN
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Complete Management Dashboard
          </Typography>
        </Box>

        <NavList />

        <Box sx={{ mt: 'auto', p: 3, borderTop: `1px solid ${colors.darkKhakhi[200]}` }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<FiLogOut />}
            onClick={handleLogout}
            sx={{ borderColor: colors.darkKhakhi[300], color: colors.darkKhakhi[700] }}
          >
            Logout
          </Button>
        </Box>
      </Paper>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Top bar */}
        <AppBar
          position="sticky"
          sx={{
            bgcolor:      'white',
            borderBottom: `1px solid ${colors.darkKhakhi[200]}`,
            boxShadow:    'none',
          }}
        >
          <Toolbar>
            <IconButton
              sx={{ display: { md: 'none' }, mr: 2 }}
              onClick={() => setDrawerOpen(true)}
            >
              <FiMenu />
            </IconButton>

            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: colors.darkKhakhi[900], flex: 1 }}
            >
              {TABS.find((t) => t.id === activeTab)?.label ?? 'Dashboard'}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton><FiBell /></IconButton>

              <Button
                variant="outlined"
                endIcon={<FiChevronDown />}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{ borderColor: colors.darkKhakhi[300], color: colors.darkKhakhi[700] }}
              >
                Admin User
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem
                  onClick={() => { navigate('/regAdmin', { replace: true }); setAnchorEl(null); }}
                >
                  <ListItemIcon><FiPlus /></ListItemIcon>
                  Add Admin
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon><FiLogOut /></ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Content area */}
        <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
          {renderContent()}
        </Box>
      </Box>

      {/* ── Mobile drawer ───────────────────────────────────────────────── */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ display: { md: 'none' } }}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Typography variant="h6" fontWeight={800} sx={{ p: 2 }}>
            TRAVAUNI ADMIN
          </Typography>
          <NavList onSelect={() => setDrawerOpen(false)} />
        </Box>
      </Drawer>

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      <TripDetailsPanel
        trip={selectedTrip}
        open={showTripDetails}
        onClose={() => {
          setShowTripDetails(false);
          setSelectedTrip(null);
        }}
      />

      {/* RegistrationDetailsModal is now rendered inside RegistrationsTab
          itself so it has direct access to the booking data it fetched.
          The one here is kept only if you need it for other flows.        */}
      <RegistrationDetailsModal
        registration={selectedReg}
        open={showRegDetails}
        onClose={() => { setShowRegDetails(false); setSelectedReg(null); }}
        onConfirm={() => {
          showSnackbar('Registration confirmed', 'success');
          setShowRegDetails(false);
        }}
      />

      {/* ── Snackbar ────────────────────────────────────────────────────── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;