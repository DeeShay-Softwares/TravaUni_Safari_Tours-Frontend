// src/components/RegistrationsTable.tsx
import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Tooltip
} from '@mui/material';
import {
  FiEye,
  FiCheckCircle,
  FiDownload,
  FiMail
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { colors } from '../assets/constants/Theme';
import type { Registration, Trip } from '../types';

interface RegistrationsTableProps {
  registrations: Registration[];
  trips: Trip[];
  onConfirm: (registrationId: string) => void;
  onViewDetails: (registration: Registration) => void;
  onFilter: (filters: any) => void;
}

const RegistrationsTable: React.FC<RegistrationsTableProps> = ({
  registrations,
  trips,
  onConfirm,
  onViewDetails,
  onFilter
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    tripId: '',
    status: '',
    paymentStatus: '',
    search: ''
  });

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const filteredRegistrations = registrations.filter(reg => {
    if (filters.tripId && reg.tripId !== filters.tripId) return false;
    if (filters.status && reg.status !== filters.status) return false;
    if (filters.paymentStatus && reg.paymentStatus !== filters.paymentStatus) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        reg.fullName.toLowerCase().includes(searchLower) ||
        reg.email.toLowerCase().includes(searchLower) ||
        reg.bookingId.toLowerCase().includes(searchLower) ||
        reg.phoneNumber.includes(filters.search)
      );
    }
    return true;
  });

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: Registration['status']) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  const getPaymentColor = (status: Registration['paymentStatus']) => {
    switch (status) {
      case 'paid': return 'success';
      case 'partial': return 'warning';
      case 'pending': return 'error';
      default: return 'default';
    }
  };

  return (
    <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
      {/* Filters */}
      <Box sx={{ p: 3, borderBottom: `1px solid ${colors.darkKhakhi[200]}` }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Registrations ({filteredRegistrations.length})
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <TextField
            select
            size="small"
            label="Trip"
            value={filters.tripId}
            onChange={(e) => handleFilterChange('tripId', e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Trips</MenuItem>
            {trips.map(trip => (
              <MenuItem key={trip.id} value={trip.id}>
                {trip.title}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Status"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            label="Payment"
            value={filters.paymentStatus}
            onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Payments</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="partial">Partial</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
          </TextField>

          <TextField
            size="small"
            label="Search"
            placeholder="Name, Email, Phone..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            sx={{ minWidth: 200 }}
          />

          <Button
            startIcon={<FiDownload />}
            variant="outlined"
            size="small"
            onClick={() => {
              // Export logic
              console.log('Exporting registrations...');
            }}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Trip</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Student</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRegistrations
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((reg) => (
                <TableRow key={reg.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {reg.bookingId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography fontWeight={600}>{reg.fullName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {reg.phoneNumber}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {reg.tripTitle}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={reg.status.toUpperCase()}
                      size="small"
                      color={getStatusColor(reg.status) as any}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={reg.paymentStatus.toUpperCase()}
                      size="small"
                      color={getPaymentColor(reg.paymentStatus) as any}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={600}>
                      ${reg.paymentAmount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={reg.isStudent ? 'STUDENT' : 'REGULAR'}
                      size="small"
                      variant={reg.isStudent ? 'filled' : 'outlined'}
                      color={reg.isStudent ? 'info' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(reg.registrationDate).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => onViewDetails(reg)}
                          sx={{ color: colors.oliveWood[600] }}
                        >
                          <FiEye />
                        </IconButton>
                      </Tooltip>

                      {reg.status === 'pending' && (
                        <Tooltip title="Confirm Registration">
                          <IconButton
                            size="small"
                            onClick={() => onConfirm(reg.id)}
                            sx={{ color: 'success.main' }}
                          >
                            <FiCheckCircle />
                          </IconButton>
                        </Tooltip>
                      )}

                      <Tooltip title="Send WhatsApp">
                        <IconButton
                          size="small"
                          onClick={() => window.open(`https://wa.me/${reg.whatsappNumber || reg.phoneNumber}`, '_blank')}
                          sx={{ color: '#25D366' }}
                        >
                          <FaWhatsapp />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Send Email">
                        <IconButton
                          size="small"
                          onClick={() => window.location.href = `mailto:${reg.email}`}
                          sx={{ color: colors.bronze[600] }}
                        >
                          <FiMail />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredRegistrations.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default RegistrationsTable;