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
  Tooltip
} from '@mui/material';
import {
  FiEye,
  FiCheckCircle,
  FiMail
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { colors } from '../assets/constants/theme';
import type { Registration } from '../types';

interface RegistrationsTableProps {
  registrations: Registration[];
  onConfirm: (registrationId: string) => void;
  onViewDetails: (registration: Registration) => void;
}

const RegistrationsTable: React.FC<RegistrationsTableProps> = ({
  registrations,
  onConfirm,
  onViewDetails,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
      case 'pending':   return 'warning';
      case 'cancelled': return 'error';
      case 'completed': return 'info';
      default:          return 'default';
    }
  };

  const getPaymentColor = (status: Registration['paymentStatus']) => {
    switch (status) {
      case 'paid':    return 'success';
      case 'partial': return 'warning';
      case 'pending': return 'error';
      default:        return 'default';
    }
  };

  return (
    <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: `1px solid ${colors.darkKhakhi[200]}` }}>
        <Typography variant="h6" fontWeight={600}>
          Registrations ({registrations.length})
        </Typography>
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
            {registrations
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
                    <Typography variant="body2">{reg.tripTitle}</Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={reg.status.toUpperCase()}
                      size="small"
                      color={getStatusColor(reg.status)}
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={reg.paymentStatus.toUpperCase()}
                      size="small"
                      color={getPaymentColor(reg.paymentStatus)}
                    />
                  </TableCell>

                  <TableCell>
                    <Typography fontWeight={600}>${reg.paymentAmount}</Typography>
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
                          onClick={() =>
                            window.open(
                              `https://wa.me/${reg.whatsappNumber || reg.phoneNumber}`,
                              '_blank',
                            )
                          }
                          sx={{ color: '#25D366' }}
                        >
                          <FaWhatsapp />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Send Email">
                        <IconButton
                          size="small"
                          onClick={() =>
                            (window.location.href = `mailto:${reg.email}`)
                          }
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
        count={registrations.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default RegistrationsTable;