// pages/admin/tabs/DashboardTab.tsx
import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { FiPackage, FiUsers, FiBell, FiDollarSign, FiPlus, FiMessageSquare } from 'react-icons/fi';
import { colors } from '@/assets/constants/theme';
import AdminInstructionsPaper from '@/pages/AdminInfoPage';
import type { TripInput, Registration } from '@/types';

interface DashboardTabProps {
  trips:         TripInput[];
  registrations: Registration[];
  onGoToTrips:   () => void;
  onGoToUpdates: () => void;
  onGoToRegs:    () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  trips,
  registrations,
  onGoToTrips,
  onGoToUpdates,
  onGoToRegs,
}) => {
  const stats = {
    totalTrips:           trips.length,
    totalRegistrations:   registrations.length,
    pendingRegistrations: registrations.filter((r) => r.status === 'pending').length,
    totalRevenue:         registrations
      .filter((r) => r.paymentStatus === 'paid')
      .reduce((sum, r) => sum + r.paymentAmount, 0),
  };

  const statCards = [
    { label: 'Total Trips',    value: stats.totalTrips,           color: colors.oliveWood[500], icon: <FiPackage /> },
    { label: 'Registrations',  value: stats.totalRegistrations,   color: colors.bronze[500],    icon: <FiUsers /> },
    { label: 'Pending',        value: stats.pendingRegistrations,  color: colors.wheat[500],     icon: <FiBell /> },
    { label: 'Revenue (ZMW)',  value: `K${stats.totalRevenue}`,   color: '#25D366',             icon: <FiDollarSign /> },
  ];

  return (
    <Box>
      {/* Stat cards */}
      <Box
        sx={{
          display:             'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', md: 'repeat(4,1fr)' },
          gap:                 3,
          mb:                  4,
        }}
      >
        {statCards.map((s, i) => (
          <Paper key={i} sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 56, height: 56, borderRadius: 2,
                  backgroundColor: `${s.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
              {React.cloneElement(s.icon as React.ReactElement<{ size: number; color: string }>, { 
  size: 24, 
  color: s.color 
})}
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={700}>{s.value}</Typography>
                <Typography variant="body2" color="text.secondary">{s.label}</Typography>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Quick actions */}
      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Quick Actions</Typography>
        <Box
          sx={{
            display:             'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3,1fr)' },
            gap:                 2,
          }}
        >
          {[
            { label: 'Upload New Trip',     icon: <FiPlus />,          onClick: onGoToTrips   },
            { label: 'Send Update',         icon: <FiMessageSquare />, onClick: onGoToUpdates },
            { label: 'View Registrations',  icon: <FiUsers />,         onClick: onGoToRegs    },
          ].map((a, i) => (
            <Button
              key={i}
              fullWidth
              variant="outlined"
              startIcon={a.icon}
              onClick={a.onClick}
              sx={{ justifyContent: 'flex-start', py: 1.5, borderRadius: 2 }}
            >
              {a.label}
            </Button>
          ))}
        </Box>
      </Paper>

      <AdminInstructionsPaper />
    </Box>
  );
};