// AdminManagement.tsx - Using CSS Grid
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
  useMediaQuery,
  useTheme,
  Divider
} from '@mui/material';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaUserShield,
  FaSearch,
  FaFilter,
  FaSort,
  FaUserCheck,
  FaUserTimes,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaKey,
  FaShieldAlt
} from 'react-icons/fa';
import { colors } from '@/assets/constants/Theme';

// Define Admin type
interface Admin {
  id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  role: 'Super Admin' | 'Admin' | 'Manager' | 'Viewer';
  status: 'Active' | 'Inactive' ;
  joinDate: string;
  lastActive: string;
  avatarColor: string;
}

// Initial admin data
const initialAdmins: Admin[] = [
  
  {
    id: '5',
    name: 'Robert Brown',
    email: 'robert@travauni.com',
    phone: '+1 (555) 234-5678',
    role: 'Admin',
    username: 'roby',
    password: '12345qwerty',
    status: 'Inactive',
    joinDate: '2023-02-18',
    lastActive: '1 week ago',
    avatarColor: colors.oliveWood[400]
  }
];

const roleOptions = ['Super Admin', 'Admin', 'Manager', 'Viewer'];
const statusOptions = ['Active', 'Inactive'];

export default function AdminManagement() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    username: '',
    role: 'Admin' as Admin['role'],
    status: 'Active' as Admin['status']
  });

  // Filter admins
  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = 
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.phone.includes(searchTerm);
    
    const matchesRole = filterRole === 'All' || admin.role === filterRole;
    const matchesStatus = filterStatus === 'All' || admin.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle form input changes
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Open add admin dialog
  const handleOpenAddDialog = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      username: '',
      password: '',
      role: 'Admin',
      status: 'Active'
    });
    setSelectedAdmin(null);
    setOpenDialog(true);
  };

  // Open edit admin dialog
  const handleOpenEditDialog = (admin: Admin) => {
    setFormData({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
      username: admin.username,
      password: admin.password,
      status: admin.status
    });
    setSelectedAdmin(admin);
    setOpenDialog(true);
  };

  // Open view admin dialog
  const handleOpenViewDialog = (admin: Admin) => {
    setSelectedAdmin(admin);
    setOpenViewDialog(true);
  };

  // Handle save admin
  const handleSaveAdmin = () => {
    if (!formData.name || !formData.email) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    if (selectedAdmin) {
      // Edit existing admin
      setAdmins(prev => prev.map(admin => 
        admin.id === selectedAdmin.id 
          ? { 
              ...admin, 
              ...formData,
              lastActive: formData.status === 'Active' ? 'Just now' : admin.lastActive
            } 
          : admin
      ));
      setSnackbar({
        open: true,
        message: 'Admin updated successfully',
        severity: 'success'
      });
    } else {
      // Add new admin
      const newAdmin: Admin = {
        id: Date.now().toString(),
        ...formData,
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: 'Never',
        avatarColor: [colors.oliveWood[500], colors.bronze[500], colors.wheat[600], colors.darkKhakhi[600]][
          Math.floor(Math.random() * 4)
        ]
      };
      setAdmins(prev => [newAdmin, ...prev]);
      setSnackbar({
        open: true,
        message: 'New admin added successfully',
        severity: 'success'
      });
    }

    setOpenDialog(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      username: '',
      password: '',
      role: 'Admin',
      status: 'Active'
    });
  };

  // Handle delete admin
  const handleDeleteAdmin = (id: string) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      setAdmins(prev => prev.filter(admin => admin.id !== id));
      setSnackbar({
        open: true,
        message: 'Admin deleted successfully',
        severity: 'success'
      });
    }
  };

  // Get status chip color
  const getStatusColor = (status: Admin['status']) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'error';
      //case 'Pending': return 'warning';
      default: return 'default';
    }
  };

  // Get role chip color
  const getRoleColor = (role: Admin['role']) => {
    switch (role) {
      case 'Super Admin': return 'error';
      case 'Admin': return 'primary';
      case 'Manager': return 'warning';
      case 'Viewer': return 'info';
      default: return 'default';
    }
  };

  // Stats calculations
  const stats = {
    total: admins.length,
    active: admins.filter(a => a.status === 'Active').length,
    superAdmins: admins.filter(a => a.role === 'Super Admin').length,
    //pending: admins.filter(a => a.status === 'Pending').length
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '98.5vw',
      backgroundColor: colors.bronze[50],
      py: { xs: 2, sm: 3, md: 4 },
      px: { xs: 1, sm: 2 },
      display: 'grid',
      gridTemplateRows: 'auto 1fr',
      gap: { xs: 2, sm: 3, md: 4 },
      overflowX: 'hidden'
    }}>
      {/* Header Section */}
      <Paper 
        elevation={8}
        sx={{
          width: '100%',
          p: { xs: 3, sm: 4 },
          backgroundColor: colors.bronze[100],
          borderRadius: { xs: '0', sm: '20px', md: '24px' },
          border: `2px solid ${colors.bronze[200]}`,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr auto' },
          gap: 3,
          alignItems: 'center'
        }}
      >
        <Box sx={{
          display: 'grid',
          gridTemplateRows: 'auto auto',
          gap: 1
        }}>
          <Typography variant="h4" sx={{
            color: colors.bronze[700],
            fontWeight: 800,
            fontSize: { xs: '24px', sm: '28px', md: '32px' },
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 2,
            alignItems: 'center'
          }}>
            <FaUserShield size={32} />
            Admin Management
          </Typography>
          <Typography sx={{
            color: colors.bronze[600],
            fontSize: { xs: '14px', sm: '16px' },
            maxWidth: '600px'
          }}>
            Manage administrators, permissions, and access controls
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<FaPlus />}
          onClick={handleOpenAddDialog}
          sx={{
            backgroundColor: colors.oliveWood[600],
            color: 'white',
            fontWeight: 700,
            fontSize: { xs: '14px', sm: '16px' },
            px: { xs: 3, sm: 4 },
            py: 1.5,
            borderRadius: '12px',
            '&:hover': {
              backgroundColor: colors.oliveWood[700],
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s',
            justifySelf: { xs: 'stretch', md: 'end' },
            width: { xs: '100%', md: 'auto' }
          }}
        >
          Add New Admin
        </Button>
      </Paper>

      {/* Main Content Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr 1fr 1fr' },
        gap: 3,
        width: '100%',
        alignContent: 'start'
      }}>
        {/* Stats Cards */}
        <Card sx={{
          backgroundColor: colors.oliveWood[50],
          border: `2px solid ${colors.oliveWood[200]}`,
          borderRadius: '16px',
          height: '100%',
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto',
          p: 3
        }}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'center',
            mb: 2
          }}>
            <Typography sx={{
              color: colors.oliveWood[800],
              fontSize: '14px',
              fontWeight: 600,
              textTransform: 'uppercase'
            }}>
              Total Admins
            </Typography>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              backgroundColor: colors.oliveWood[100],
              display: 'grid',
              placeItems: 'center'
            }}>
              <FaUserShield size={24} color={colors.oliveWood[600]} />
            </Box>
          </Box>
          <Typography variant="h3" sx={{
            color: colors.oliveWood[900],
            fontWeight: 800,
            fontSize: '36px',
            mb: 1,
            alignSelf: 'center'
          }}>
            {stats.total}
          </Typography>
          <Typography sx={{
            color: colors.oliveWood[600],
            fontSize: '14px',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 1,
            alignItems: 'center'
          }}>
            <FaUserCheck size={12} />
            {stats.active} active
          </Typography>
        </Card>

        <Card sx={{
          backgroundColor: colors.bronze[50],
          border: `2px solid ${colors.bronze[200]}`,
          borderRadius: '16px',
          height: '100%',
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto',
          p: 3
        }}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'center',
            mb: 2
          }}>
            <Typography sx={{
              color: colors.bronze[800],
              fontSize: '14px',
              fontWeight: 600,
              textTransform: 'uppercase'
            }}>
              Active Admins
            </Typography>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              backgroundColor: colors.bronze[100],
              display: 'grid',
              placeItems: 'center'
            }}>
              <FaUserCheck size={24} color={colors.bronze[600]} />
            </Box>
          </Box>
          <Typography variant="h3" sx={{
            color: colors.bronze[900],
            fontWeight: 800,
            fontSize: '36px',
            mb: 1,
            alignSelf: 'center'
          }}>
            {stats.active}
          </Typography>
          <Typography sx={{
            color: colors.bronze[600],
            fontSize: '14px',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 1,
            alignItems: 'center'
          }}>
            <FaShieldAlt size={12} />
            {stats.superAdmins} super admins
          </Typography>
        </Card>

        <Card sx={{
          backgroundColor: colors.wheat[50],
          border: `2px solid ${colors.wheat[300]}`,
          borderRadius: '16px',
          height: '100%',
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto',
          p: 3
        }}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'center',
            mb: 2
          }}>
            <Typography sx={{
              color: colors.wheat[800],
              fontSize: '14px',
              fontWeight: 600,
              textTransform: 'uppercase'
            }}>
              Super Admins
            </Typography>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              backgroundColor: colors.wheat[100],
              display: 'grid',
              placeItems: 'center'
            }}>
              <FaShieldAlt size={24} color={colors.wheat[600]} />
            </Box>
          </Box>
          <Typography variant="h3" sx={{
            color: colors.wheat[900],
            fontWeight: 800,
            fontSize: '36px',
            mb: 1,
            alignSelf: 'center'
          }}>
            {stats.superAdmins}
          </Typography>
          <Typography sx={{
            color: colors.wheat[600],
            fontSize: '14px'
          }}>
            Full system access
          </Typography>
        </Card>

        {/* <Card sx={{
          backgroundColor: colors.darkKhakhi[50],
          border: `2px solid ${colors.darkKhakhi[200]}`,
          borderRadius: '16px',
          height: '100%',
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto',
          p: 3
        }}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'center',
            mb: 2
          }}>
            <Typography sx={{
              color: colors.darkKhakhi[800],
              fontSize: '14px',
              fontWeight: 600,
              textTransform: 'uppercase'
            }}>
              Pending
            </Typography>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              backgroundColor: colors.darkKhakhi[100],
              display: 'grid',
              placeItems: 'center'
            }}>
              <FaUserTimes size={24} color={colors.darkKhakhi[600]} />
            </Box>
          </Box>
          <Typography variant="h3" sx={{
            color: colors.darkKhakhi[900],
            fontWeight: 800,
            fontSize: '36px',
            mb: 1,
            alignSelf: 'center'
          }}>
            {stats.pending}
          </Typography>
          <Typography sx={{
            color: colors.darkKhakhi[600],
            fontSize: '14px'
          }}>
            Awaiting activation
          </Typography>
        </Card> */}
      </Box>

      {/* Search and Filter Section */}
      <Paper 
        elevation={4}
        sx={{
          width: '100%',
          p: 3,
          backgroundColor: 'white',
          borderRadius: '16px',
          border: `1px solid ${colors.darkKhakhi[200]}`,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr auto auto' },
          gap: 3,
          alignItems: 'center'
        }}
      >
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: 2,
          alignItems: 'center'
        }}>
          <FaSearch color={colors.darkKhakhi[500]} />
          <TextField
            fullWidth
            placeholder="Search admins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '&:hover fieldset': {
                  borderColor: colors.oliveWood[400],
                },
              }
            }}
          />
        </Box>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: 2,
          alignItems: 'center',
          minWidth: '200px'
        }}>
          <FaFilter color={colors.darkKhakhi[500]} />
          <FormControl fullWidth size="small">
            <InputLabel>Role</InputLabel>
            <Select
              value={filterRole}
              label="Role"
              onChange={(e) => setFilterRole(e.target.value)}
              sx={{ borderRadius: '12px' }}
            >
              <MenuItem value="All">All Roles</MenuItem>
              {roleOptions.map(role => (
                <MenuItem key={role} value={role}>{role}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: 2,
          alignItems: 'center',
          minWidth: '200px'
        }}>
          <FaSort color={colors.darkKhakhi[500]} />
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
              sx={{ borderRadius: '12px' }}
            >
              <MenuItem value="All">All Status</MenuItem>
              {statusOptions.map(status => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Admins Table */}
      <Paper 
        elevation={4}
        sx={{
          width: '100%',
          overflow: 'hidden',
          backgroundColor: 'white',
          borderRadius: '16px',
          border: `1px solid ${colors.darkKhakhi[200]}`,
          display: 'grid',
          gridTemplateRows: 'auto 1fr'
        }}
      >
        <TableContainer sx={{ maxHeight: '600px' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: colors.wheat[50] }}>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  color: colors.darkKhakhi[800],
                  minWidth: '200px'
                }}>Admin</TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  color: colors.darkKhakhi[800],
                  minWidth: '200px'
                }}>Contact</TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  color: colors.darkKhakhi[800],
                  minWidth: '120px'
                }}>Role</TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  color: colors.darkKhakhi[800],
                  minWidth: '120px'
                }}>Status</TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  color: colors.darkKhakhi[800],
                  minWidth: '120px'
                }}>Last Active</TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  color: colors.darkKhakhi[800],
                  minWidth: '150px'
                }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAdmins.map((admin) => (
                <TableRow 
                  key={admin.id}
                  hover
                  sx={{
                    '&:hover': {
                      backgroundColor: colors.wheat[50],
                    }
                  }}
                >
                  <TableCell>
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'auto 1fr', 
                      gap: 2,
                      alignItems: 'center'
                    }}>
                      <Avatar sx={{ 
                        bgcolor: admin.avatarColor,
                        width: 48,
                        height: 48,
                        fontWeight: 700
                      }}>
                        {admin.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Box sx={{
                        display: 'grid',
                        gridTemplateRows: 'auto auto',
                        gap: 0.5
                      }}>
                        <Typography sx={{ 
                          fontWeight: 600, 
                          color: colors.darkKhakhi[900],
                          fontSize: '16px'
                        }}>
                          {admin.name}
                        </Typography>
                        <Typography sx={{ 
                          color: colors.darkKhakhi[500],
                          fontSize: '14px',
                          display: 'grid',
                          gridTemplateColumns: 'auto 1fr',
                          gap: 1,
                          alignItems: 'center'
                        }}>
                          <FaCalendar size={12} />
                          Joined {admin.joinDate}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateRows: 'auto auto',
                      gap: 1
                    }}>
                      <Typography sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'auto 1fr', 
                        gap: 1,
                        alignItems: 'center',
                        color: colors.darkKhakhi[700],
                        fontSize: '14px'
                      }}>
                        <FaEnvelope size={12} />
                        {admin.email}
                      </Typography>
                      <Typography sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'auto 1fr', 
                        gap: 1,
                        alignItems: 'center',
                        color: colors.darkKhakhi[700],
                        fontSize: '14px'
                      }}>
                        <FaPhone size={12} />
                        {admin.phone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={admin.role}
                      color={getRoleColor(admin.role)}
                      size="small"
                      sx={{ 
                        fontWeight: 600,
                        minWidth: '80px'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={admin.status}
                      color={getStatusColor(admin.status)}
                      size="small"
                      sx={{ 
                        fontWeight: 600,
                        minWidth: '80px'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ 
                      color: colors.darkKhakhi[600],
                      fontWeight: admin.lastActive === 'Just now' ? 700 : 500,
                      fontSize: '14px'
                    }}>
                      {admin.lastActive}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(3, auto)',
                      gap: 1,
                      width: 'fit-content'
                    }}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenViewDialog(admin)}
                        sx={{
                          backgroundColor: colors.oliveWood[50],
                          color: colors.oliveWood[600],
                          '&:hover': {
                            backgroundColor: colors.oliveWood[100]
                          }
                        }}
                      >
                        <FaEye size={14} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEditDialog(admin)}
                        sx={{
                          backgroundColor: colors.bronze[50],
                          color: colors.bronze[600],
                          '&:hover': {
                            backgroundColor: colors.bronze[100]
                          }
                        }}
                      >
                        <FaEdit size={14} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteAdmin(admin.id)}
                        disabled={admin.role === 'Super Admin'}
                        sx={{
                          backgroundColor: admin.role === 'Super Admin' ? colors.darkKhakhi[100] : colors.wheat[50],
                          color: admin.role === 'Super Admin' ? colors.darkKhakhi[400] : colors.wheat[600],
                          '&:hover': admin.role !== 'Super Admin' ? {
                            backgroundColor: colors.wheat[100]
                          } : {}
                        }}
                      >
                        <FaTrash size={14} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredAdmins.length === 0 && (
          <Box sx={{ 
            display: 'grid',
            placeItems: 'center',
            py: 8,
            color: colors.darkKhakhi[400]
          }}>
            <Box sx={{
              display: 'grid',
              gridTemplateRows: 'auto auto',
              gap: 2,
              justifyItems: 'center'
            }}>
              <FaUserTimes size={48} />
              <Box sx={{
                display: 'grid',
                gridTemplateRows: 'auto auto',
                gap: 1,
                textAlign: 'center'
              }}>
                <Typography sx={{ fontWeight: 600 }}>
                  No admins found
                </Typography>
                <Typography>
                  Try adjusting your search or filters
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Add/Edit Admin Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            backgroundColor: colors.wheat[50],
            display: 'grid',
            gridTemplateRows: 'auto 1fr auto'
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: colors.bronze[100],
          color: colors.bronze[700],
          fontWeight: 700,
          fontSize: '24px',
          borderBottom: `2px solid ${colors.bronze[200]}`,
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: 2,
          alignItems: 'center'
        }}>
          <FaUserShield />
          {selectedAdmin ? 'Edit Admin' : 'Add New Admin'}
        </DialogTitle>
        
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 3
          }}>
            <Box sx={{
              display: 'grid',
              gridTemplateRows: 'auto auto auto',
              gap: 3,
              gridColumn: { xs: 'span 1', sm: 'span 2' },
              mt: isMobile ? 2 : 2
                          }}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px'
                  }
                }}
              />
              
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px'
                  }
                }}
              />
              
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px'
                  }
                }}
              />
            

            <TextField
                fullWidth
                label="Username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px'
                  }
                }}
              />
            

            <TextField
                fullWidth
                label="Password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px'
                  }
                }}
              />
            </Box>

            <FormControl fullWidth>
            <InputLabel sx={{mt: isMobile? 2: 0}}>Role *</InputLabel>
              <Select
                value={formData.role}
                label="Role *"
                onChange={(e) => handleInputChange('role', e.target.value as Admin['role'])}
                sx={{ borderRadius: '12px',
mt: isMobile? 2: 0
                 }}
              >
                {roleOptions.map(role => (
                  <MenuItem key={role} value={role}>{role}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Status *</InputLabel>
              <Select
                value={formData.status}
                label="Status *"
                onChange={(e) => handleInputChange('status', e.target.value as Admin['status'])}
                sx={{ borderRadius: '12px' }}
              >
                {statusOptions.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {!selectedAdmin && (
              <Box sx={{ 
                gridColumn: 'span 2',
                display: 'grid',
                gridTemplateRows: 'auto auto',
                gap: 1
              }}>
                <Alert 
                  severity="info" 
                  icon={<FaKey />}
                  sx={{
                    borderRadius: '12px',
                    backgroundColor: colors.oliveWood[50],
                    border: `1px solid ${colors.oliveWood[200]}`
                  }}
                >
                  <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
                    Credentials Information
                  </Typography>
                  <Typography sx={{ fontSize: '14px' }}>
                    An alert message will be sent to the admin's email.
                  </Typography>
                </Alert>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ 
          p: 3, 
          borderTop: `1px solid ${colors.darkKhakhi[200]}`,
          display: 'grid',
          gridTemplateColumns: '1fr auto auto',
          gap: 2
        }}>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{
              color: colors.darkKhakhi[600],
              fontWeight: 600,
              px: 4,
              py: 1
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveAdmin}
            sx={{
              backgroundColor: colors.oliveWood[600],
              color: 'white',
              fontWeight: 700,
              px: 4,
              py: 1,
              borderRadius: '12px',
              '&:hover': {
                backgroundColor: colors.oliveWood[700]
              }
            }}
          >
            {selectedAdmin ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Admin Dialog */}
      <Dialog 
        open={openViewDialog} 
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            backgroundColor: colors.wheat[50],
            display: 'grid',
            gridTemplateRows: 'auto 1fr auto'
          }
        }}
      >
        {selectedAdmin && (
          <>
            <DialogTitle sx={{ 
              backgroundColor: colors.oliveWood[50],
              color: colors.oliveWood[700],
              fontWeight: 700,
              fontSize: '24px',
              borderBottom: `2px solid ${colors.oliveWood[200]}`,
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: 2,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FaUserShield />
              Admin Details
            </DialogTitle>
            
            <DialogContent sx={{ p: 4 }}>
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'auto 1fr' },
                gap: 4,
                alignItems: 'start',
                mt: 2
              }}>
                {/* Left Column - Avatar & Basic Info */}
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateRows: 'auto auto auto',
                  gap: 2,
                  justifyItems: 'center'
                }}>
                  <Avatar sx={{ 
                    bgcolor: selectedAdmin.avatarColor,
                    width: 120,
                    height: 120,
                    fontSize: '36px',
                    fontWeight: 700
                  }}>
                    {selectedAdmin.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  
                  <Box sx={{ 
                    display: 'grid',
                    gridTemplateRows: 'auto auto',
                    gap: 1,
                    textAlign: 'center'
                  }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 800,
                      color: colors.darkKhakhi[900]
                    }}>
                      {selectedAdmin.name}
                    </Typography>
                    <Chip 
                      label={selectedAdmin.role}
                      color={getRoleColor(selectedAdmin.role)}
                      sx={{ 
                        fontWeight: 700,
                        fontSize: '15px'
                      }}
                    />
                  </Box>
                  
                  <Chip 
                    label={selectedAdmin.status}
                    color={getStatusColor(selectedAdmin.status)}
                    sx={{ 
                      fontWeight: 700,
                      fontSize: '14px'
                    }}
                  />
                </Box>

                {/* Right Column - Details */}
                <Box sx={{
                  display: 'grid',
                  gridTemplateRows: 'auto 1fr',
                  gap: 3
                }}>
                  {/* Contact Info */}
                  <Box sx={{ 
                    p: 3,
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    border: `1px solid ${colors.darkKhakhi[200]}`
                  }}>
                    <Typography sx={{ 
                      fontWeight: 700,
                      color: colors.darkKhakhi[800],
                      mb: 2,
                      fontSize: '18px'
                    }}>
                      Contact Information
                    </Typography>
                    
                    <Box sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                      gap: 2
                    }}>
                      <Box sx={{ 
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr',
                        gap: 2,
                        p: 2,
                        backgroundColor: colors.wheat[50],
                        borderRadius: '12px'
                      }}>
                        <FaEnvelope size={20} color={colors.bronze[600]} />
                        <Box>
                          <Typography sx={{ 
                            color: colors.darkKhakhi[600],
                            fontSize: '14px',
                            fontWeight: 500
                          }}>
                            Email
                          </Typography>
                          <Typography sx={{ 
                            color: colors.darkKhakhi[900],
                            fontWeight: 600
                          }}>
                            {selectedAdmin.email}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ 
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr',
                        gap: 2,
                        p: 2,
                        backgroundColor: colors.wheat[50],
                        borderRadius: '12px'
                      }}>
                        <FaPhone size={20} color={colors.bronze[600]} />
                        <Box>
                          <Typography sx={{ 
                            color: colors.darkKhakhi[600],
                            fontSize: '14px',
                            fontWeight: 500
                          }}>
                            Phone
                          </Typography>
                          <Typography sx={{ 
                            color: colors.darkKhakhi[900],
                            fontWeight: 600
                          }}>
                            {selectedAdmin.phone}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ 
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr',
                        gap: 10,
                        p: 2,
                        backgroundColor: colors.wheat[50],
                        borderRadius: '12px',
                        mt: 2
                      }}>
                        <Box>
                          <Typography sx={{ 
                            color: colors.darkKhakhi[600],
                            fontSize: '14px',
                            fontWeight: 500
                          }}>
                            Username
                          </Typography>
                          <Typography sx={{ 
                            color: colors.darkKhakhi[900],
                            fontWeight: 200
                          }}>
                            {selectedAdmin.username}
                          </Typography>
                        </Box>
                         <Box>
                          <Typography sx={{ 
                            color: colors.darkKhakhi[600],
                            fontSize: '14px',
                            fontWeight: 500
                          }}>
                           Password
                          </Typography>
                          <Typography sx={{ 
                            color: colors.darkKhakhi[900],
                            fontWeight: 200
                          }}>
                            {selectedAdmin.password}
                          </Typography>
                        </Box>
                      </Box>
                  </Box>

                  {/* Activity Info */}
                  <Box sx={{ 
                    p: 3,
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    border: `1px solid ${colors.darkKhakhi[200]}`,
                    display: 'grid',
                    gridTemplateRows: 'auto 1fr',
                    gap: 2
                  }}>
                    <Typography sx={{ 
                      fontWeight: 700,
                      color: colors.darkKhakhi[800],
                      fontSize: '18px'
                    }}>
                      Activity Information
                    </Typography>
                    
                    <Box sx={{
                      display: 'grid',
                      gridTemplateRows: 'repeat(3, auto)',
                      gap: 2
                    }}>
                      <Box sx={{ 
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        alignItems: 'center',
                        p: 1.5
                      }}>
                        <Typography sx={{ color: colors.darkKhakhi[600] }}>
                          Joined Date
                        </Typography>
                        <Typography sx={{ fontWeight: 600 }}>
                          {selectedAdmin.joinDate}
                        </Typography>
                      </Box>
                      
                      <Divider />
                      
                      <Box sx={{ 
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        alignItems: 'center',
                        p: 1.5
                      }}>
                        <Typography sx={{ color: colors.darkKhakhi[600] }}>
                          Last Active
                        </Typography>
                        <Typography sx={{ fontWeight: 600 }}>
                          {selectedAdmin.lastActive}
                        </Typography>
                      </Box>
                      
                      <Divider />
                      
                      <Box sx={{ 
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        alignItems: 'center',
                        p: 1.5
                      }}>
                        <Typography sx={{ color: colors.darkKhakhi[600] }}>
                          Account ID
                        </Typography>
                        <Typography sx={{ 
                          fontWeight: 600,
                          color: colors.darkKhakhi[500],
                          fontSize: '14px'
                        }}>
                          #{selectedAdmin.id}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </DialogContent>

            <DialogActions sx={{ 
              p: 3, 
              borderTop: `1px solid ${colors.darkKhakhi[200]}`,
              display: 'grid',
              gridTemplateColumns: '1fr auto auto',
              gap: 2
            }}>
              <Button
                onClick={() => setOpenViewDialog(false)}
                sx={{
                  color: colors.darkKhakhi[600],
                  fontWeight: 600
                }}
              >
                Close
              </Button>
              <Button
                variant="outlined"
                startIcon={<FaEdit />}
                onClick={() => {
                  setOpenViewDialog(false);
                  handleOpenEditDialog(selectedAdmin);
                }}
                sx={{
                  borderColor: colors.bronze[400],
                  color: colors.bronze[600],
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: colors.bronze[600]
                  }
                }}
              >
                Edit
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            borderRadius: '12px'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}