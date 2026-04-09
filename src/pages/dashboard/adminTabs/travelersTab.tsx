// pages/admin/tabs/TravelersTab.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  CircularProgress,
  Pagination,
  Avatar,
  Button,
} from "@mui/material";
import { FiSearch, FiCheckCircle, FiRefreshCw } from "react-icons/fi";
import { colors } from "@/assets/constants/theme";
import TravelerServices from "@/ApiCalls/travelerApi";
import BookingServices from "@/ApiCalls/BookingApi";
import type { TravelerResponse } from "@/ApiCalls/travelerApi";
import type { SnackbarState } from "@/types";

interface TravelersTabProps {
  showSnackbar: (msg: string, sev: SnackbarState["severity"]) => void;
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  confirmed: { bg: "#dcfce7", color: "#15803d" },
  pending: { bg: "#fef9c3", color: "#854d0e" },
  cancelled: { bg: "#fee2e2", color: "#b91c1c" },
  completed: { bg: "#dbeafe", color: "#1d4ed8" },
};

const LIMIT = 10;

export const TravelersTab: React.FC<TravelersTabProps> = ({ showSnackbar }) => {
  const [travelers, setTravelers] = useState<TravelerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirming, setConfirming] = useState<string | null>(null);

  // ── Stabilise showSnackbar ──────────────────────────────────────────────────
  // showSnackbar comes from the parent and gets a new reference on every render.
  // Putting it in useCallback's dep array would cause fetchTravelers to
  // re-create on every parent render, which in turn would re-trigger the
  // useEffect and cause an infinite fetch loop.
  //
  // Solution: store it in a ref.  The ref is always up-to-date (no stale
  // closure) but its identity never changes, so it is safe to omit from deps.
  const showSnackbarRef = useRef(showSnackbar);
  useEffect(() => {
    showSnackbarRef.current = showSnackbar;
  }, [showSnackbar]);

  // ── Fetch ───────────────────────────────────────────────────────────────────
  // fetchTravelers only depends on page and search — both are stable primitives.
  // showSnackbar is accessed via the ref so it is NOT a dependency.
  const fetchTravelers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await TravelerServices.getAllTravelers({
        page,
        limit: LIMIT,
        search: search || undefined,
      });
      setTravelers(result.data);
      setTotalPages(result.pagination.pages);
    } catch {
      showSnackbarRef.current("Failed to load travelers", "error");
    } finally {
      setLoading(false);
    }
  }, [page, search]); // ✅ no showSnackbar dep needed — accessed via ref

  // Fetch whenever page changes (immediate — no debounce needed for pagination)
  useEffect(() => {
    fetchTravelers();
  }, [fetchTravelers]); // ✅ fetchTravelers is the correct single dependency

  // Debounce search input — resets to page 1 then triggers a fetch via the
  // page state change which causes fetchTravelers to re-create, which causes
  // the effect above to fire.  No need to call fetchTravelers directly here.
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1); // changing page → new fetchTravelers ref → effect above fires
    }, 400);
    return () => clearTimeout(timer);
  }, [search]); // ✅ only search is a dep here — no fetchTravelers needed

  // ── Confirm booking ─────────────────────────────────────────────────────────
  const handleConfirmBooking = async (bookingId: string) => {
    setConfirming(bookingId);
    try {
      await BookingServices.confirmBooking(bookingId);
      showSnackbarRef.current(
        "Booking confirmed — confirmation email sent to traveler",
        "success",
      );
      fetchTravelers();
    } catch {
      showSnackbarRef.current("Failed to confirm booking", "error");
    } finally {
      setConfirming(null);
    }
  };

  // Latest booking helper
  const latestBooking = (t: TravelerResponse) =>
    t.bookingHistory && t.bookingHistory.length > 0
      ? t.bookingHistory[t.bookingHistory.length - 1]
      : null;

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Travelers
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View all registered travelers and confirm their bookings
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<FiRefreshCw />}
            onClick={fetchTravelers}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search by name or ID number…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mt: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FiSearch color={colors.darkKhakhi[400]} />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, overflow: "hidden" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: colors.wheat[50] }}>
              {[
                "Traveler",
                "ID Number",
                "Nationality",
                "Student",
                "Latest Booking",
                "Payment",
                "Status",
                "Actions",
              ].map((h) => (
                <TableCell
                  key={h}
                  sx={{ fontWeight: 700, color: colors.darkKhakhi[700] }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : travelers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    No travelers found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              travelers.map((t) => {
                const booking = latestBooking(t);
                const statusStyle = booking
                  ? (STATUS_COLORS[booking.status] ?? STATUS_COLORS.pending)
                  : null;

                return (
                  <TableRow
                    key={t._id}
                    sx={{ "&:hover": { bgcolor: colors.wheat[50] } }}
                  >
                    {/* Traveler */}
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: colors.oliveWood[500],
                            width: 36,
                            height: 36,
                            fontSize: 14,
                          }}
                        >
                          {t.fullName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography fontWeight={600} fontSize={14}>
                            {t.fullName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Age {t.age} · {t.gender}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* ID */}
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "monospace" }}
                      >
                        {t.idNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t.idType}
                      </Typography>
                    </TableCell>

                    {/* Nationality */}
                    <TableCell>
                      <Typography variant="body2">{t.nationality}</Typography>
                    </TableCell>

                    {/* Student */}
                    <TableCell>
                      {t.isStudent ? (
                        <Chip
                          label="Student"
                          size="small"
                          sx={{
                            bgcolor: colors.wheat[100],
                            color: colors.bronze[700],
                          }}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          —
                        </Typography>
                      )}
                    </TableCell>

                    {/* Latest booking ref */}
                    <TableCell>
                      {booking ? (
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: "monospace", fontSize: 12 }}
                        >
                          {booking.bookingNumber}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No bookings
                        </Typography>
                      )}
                    </TableCell>

                    {/* Payment */}
                    <TableCell>
                      {booking ? (
                        <Typography variant="body2">
                          K{booking.totalPrice?.toLocaleString() ?? "—"}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          —
                        </Typography>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      {booking && statusStyle ? (
                        <Chip
                          label={booking.status}
                          size="small"
                          sx={{
                            bgcolor: statusStyle.bg,
                            color: statusStyle.color,
                            fontWeight: 600,
                            textTransform: "capitalize",
                          }}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          —
                        </Typography>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        {/* Confirm booking — only if latest booking is pending */}
                        {booking && booking.status === "pending" && (
                          <Tooltip title="Confirm booking & send email">
                            <span>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleConfirmBooking(booking._id)
                                }
                                disabled={confirming === booking._id}
                                sx={{ color: "#15803d" }}
                              >
                                {confirming === booking._id ? (
                                  <CircularProgress size={16} />
                                ) : (
                                  <FiCheckCircle size={18} />
                                )}
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, v) => setPage(v)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};
