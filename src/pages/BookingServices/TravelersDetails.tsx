// TravelerDetails.tsx - Step 3 with multi-traveler support
import {
  Box, Typography, TextField, MenuItem, FormControl,
  InputLabel, Select, IconButton, Button,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  FaUser, FaEnvelope, FaPhone, FaIdCard, FaVenusMars,
  FaGraduationCap, FaPlus, FaTrash, FaUsers
} from 'react-icons/fa6';
import { FaInfoCircle } from 'react-icons/fa';
import { Theme } from '@/assets/constants/colors';
import { useState, useMemo, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Traveler {
  id: string;
  fullName: string;
  age: string;
  gender: string;
  idNumber: string;
  isStudent: boolean;
  schoolName: string;
}

export interface TravelerInfo {
  email: string;
  phone: string;
  mainTraveler: Traveler;
  additionalTravelers: Traveler[];
}

interface TravelerDetailsProps {
  onTravelerInfoSubmit?: (travelerInfo: TravelerInfo) => void;
  initialData?: TravelerInfo | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const emptyTraveler = (id = 'main'): Traveler => ({
  id,
  fullName: '',
  age: '',
  gender: '',
  idNumber: '',
  isStudent: false,
  schoolName: '',
});

const isTravelerValid = (t: Traveler) =>
  Boolean(t.fullName && t.age && t.gender && t.idNumber);

const isEmailValid = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isPhoneValid = (phone: string) => phone.length >= 10;

// ─── Shared field styles ──────────────────────────────────────────────────────

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': { borderColor: Theme['olive-wood'][400] },
    '&.Mui-focused fieldset': { borderColor: Theme['olive-wood'][500] },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: Theme['olive-wood'][500] },
};

const selectSx = {
  '& .MuiOutlinedInput-notchedOutline': { borderColor: Theme['dark-khakhi'][300] },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: Theme['olive-wood'][400] },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: Theme['olive-wood'][500] },
};

const labelSx = {
  color: Theme['dark-khakhi'][600],
  '&.Mui-focused': { color: Theme['olive-wood'][500] },
};

const iconStyle = { marginRight: 10, color: Theme.bronze[500] };

// ─── TravelerForm sub-component ───────────────────────────────────────────────

interface TravelerFormProps {
  traveler: Traveler;
  isMain: boolean;
  index?: number;
  onChange: (field: keyof Traveler, value: string | boolean) => void;
  onRemove?: () => void;
}

function TravelerForm({ traveler, isMain, index, onChange, onRemove }: TravelerFormProps) {
  return (
    <Box sx={{
      p: 3,
      mb: 3,
      border: `1px solid ${Theme.bronze[200]}`,
      borderRadius: 3,
      backgroundColor: isMain ? Theme.wheat[50] : 'white',
    }}>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        pb: 2,
        borderBottom: `2px solid ${Theme.bronze[200]}`,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: '50%',
            backgroundColor: Theme.bronze[100],
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FaUsers size={20} color={Theme.bronze[600]} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: Theme.bronze[700] }}>
            {isMain ? 'Main Traveler' : `Traveler ${index}`}
          </Typography>
        </Box>
        {!isMain && onRemove && (
          <IconButton
            onClick={onRemove}
            aria-label="Remove traveler"
            sx={{
              color: Theme.bronze[600],
              '&:hover': { backgroundColor: Theme.bronze[100], color: Theme.bronze[800] },
            }}
          >
            <FaTrash />
          </IconButton>
        )}
      </Box>

      {/* Fields */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 3,
      }}>
        <TextField
          fullWidth required
          label="Full Name"
          placeholder="Enter full name as per ID"
          value={traveler.fullName}
          onChange={(e) => onChange('fullName', e.target.value)}
          InputProps={{ startAdornment: <FaUser style={iconStyle} /> }}
          sx={fieldSx}
        />

        <TextField
          fullWidth required
          label="Age"
          type="number"
          placeholder="Enter age"
          value={traveler.age}
          onChange={(e) => onChange('age', e.target.value)}
          InputProps={{ startAdornment: <FaIdCard style={iconStyle} /> }}
          sx={fieldSx}
        />

        <FormControl fullWidth required>
          <InputLabel sx={labelSx}>Gender</InputLabel>
          <Select
            value={traveler.gender}
            label="Gender"
            onChange={(e: SelectChangeEvent) => onChange('gender', e.target.value)}
            startAdornment={<FaVenusMars style={iconStyle} />}
            sx={selectSx}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
            <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth required
          label="ID / Passport Number"
          placeholder="Enter ID or passport number"
          value={traveler.idNumber}
          onChange={(e) => onChange('idNumber', e.target.value)}
          InputProps={{ startAdornment: <FaIdCard style={iconStyle} /> }}
          sx={fieldSx}
        />

        <FormControl fullWidth>
          <InputLabel sx={labelSx}>Student Status (Optional)</InputLabel>
          <Select
            value={traveler.isStudent ? 'yes' : 'no'}
            label="Student Status (Optional)"
            onChange={(e: SelectChangeEvent) => {
              const student = e.target.value === 'yes';
              onChange('isStudent', student);
              if (!student) onChange('schoolName', '');
            }}
            startAdornment={<FaGraduationCap style={iconStyle} />}
            sx={selectSx}
          >
            <MenuItem value="no">No</MenuItem>
            <MenuItem value="yes">Yes</MenuItem>
          </Select>
        </FormControl>

        {traveler.isStudent && (
          <TextField
            fullWidth
            label="School / University Name"
            placeholder="Enter school or university name"
            value={traveler.schoolName}
            onChange={(e) => onChange('schoolName', e.target.value)}
            InputProps={{ startAdornment: <FaGraduationCap style={iconStyle} /> }}
            sx={fieldSx}
          />
        )}
      </Box>
    </Box>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const MAX_TRAVELERS = 6;

export default function TravelerDetails({ onTravelerInfoSubmit, initialData }: TravelerDetailsProps) {
  const [formData, setFormData] = useState<TravelerInfo>(() => ({
    email: initialData?.email ?? '',
    phone: initialData?.phone ?? '',
    mainTraveler: initialData?.mainTraveler ?? emptyTraveler('main'),
    additionalTravelers: initialData?.additionalTravelers ?? [],
  }));

  // ── Derived validation (single source of truth) ──────────────────────────

  const validation = useMemo(() => {
    const mainValid = isTravelerValid(formData.mainTraveler);
    const addlValid = formData.additionalTravelers.every(isTravelerValid);
    const emailOk   = isEmailValid(formData.email);
    const phoneOk   = isPhoneValid(formData.phone);
    const isValid   = mainValid && addlValid && emailOk && phoneOk;

    const missing: string[] = [];
    if (!emailOk)                          missing.push('valid email');
    if (!phoneOk)                          missing.push('valid phone');
    if (!formData.mainTraveler.fullName)   missing.push('main traveler name');
    if (!formData.mainTraveler.age)        missing.push('main traveler age');
    if (!formData.mainTraveler.gender)     missing.push('main traveler gender');
    if (!formData.mainTraveler.idNumber)   missing.push('main traveler ID');
    if (!addlValid && formData.additionalTravelers.length)
      missing.push('all additional traveler details');

    return { isValid, missing };
  }, [formData]);

  const totalTravelers = formData.additionalTravelers.length + 1;

  // ── Handlers ─────────────────────────────────────────────────────────────

  const updateMainTraveler = useCallback((field: keyof Traveler, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      mainTraveler: { ...prev.mainTraveler, [field]: value },
    }));
  }, []);

  const updateAdditionalTraveler = useCallback((id: string, field: keyof Traveler, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      additionalTravelers: prev.additionalTravelers.map(t =>
        t.id === id ? { ...t, [field]: value } : t
      ),
    }));
  }, []);

  const addTraveler = useCallback(() => {
    if (totalTravelers >= MAX_TRAVELERS) return;
    setFormData(prev => ({
      ...prev,
      additionalTravelers: [...prev.additionalTravelers, emptyTraveler(Date.now().toString())],
    }));
  }, [totalTravelers]);

  const removeTraveler = useCallback((id: string) => {
    setFormData(prev => ({
      ...prev,
      additionalTravelers: prev.additionalTravelers.filter(t => t.id !== id),
    }));
  }, []);

  const handleTravelerCountChange = useCallback((value: string) => {
    const target = parseInt(value, 10);
    if (isNaN(target)) return;
    const delta = target - totalTravelers;

    if (delta > 0) {
      const newTravelers = Array.from({ length: delta }, () =>
        emptyTraveler(Date.now().toString() + Math.random())
      );
      setFormData(prev => ({
        ...prev,
        additionalTravelers: [...prev.additionalTravelers, ...newTravelers],
      }));
    } else if (delta < 0) {
      setFormData(prev => ({
        ...prev,
        additionalTravelers: prev.additionalTravelers.slice(0, target - 1),
      }));
    }
  }, [totalTravelers]);

  // ── Submit handler (explicit button, not auto-submit on every keystroke) ──

  const handleSubmit = () => {
    if (validation.isValid && onTravelerInfoSubmit) {
      onTravelerInfoSubmit(formData);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      p: { xs: 2, sm: 3, md: 4 },
    }}>
      {/* Header */}
      <Box>
        <Typography variant="h4" sx={{ color: Theme.bronze[700], fontWeight: 600, mb: 1 }}>
          Traveler Information
        </Typography>
        <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '16px' }}>
          Please provide details for all travelers
        </Typography>
      </Box>

      {/* Contact Info */}
      <Box sx={{ p: 3, border: `1px solid ${Theme.bronze[200]}`, borderRadius: 3, backgroundColor: Theme.wheat[50] }}>
        <Typography variant="h6" sx={{
          fontWeight: 600, color: Theme.bronze[700], mb: 3,
          display: 'flex', alignItems: 'center', gap: 1,
        }}>
          <FaEnvelope /> Contact Information
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
          <TextField
            fullWidth required
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            error={formData.email !== '' && !isEmailValid(formData.email)}
            helperText={formData.email !== '' && !isEmailValid(formData.email) ? 'Please enter a valid email address' : ''}
            InputProps={{ startAdornment: <FaEnvelope style={iconStyle} /> }}
            sx={fieldSx}
          />

          <TextField
            fullWidth required
            label="Phone Number"
            placeholder="+1 234 567 8900"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            error={formData.phone !== '' && !isPhoneValid(formData.phone)}
            helperText={formData.phone !== '' && !isPhoneValid(formData.phone) ? 'Please enter a valid phone number (at least 10 digits)' : ''}
            InputProps={{ startAdornment: <FaPhone style={iconStyle} /> }}
            sx={fieldSx}
          />
        </Box>
      </Box>

      {/* Traveler Count Selector */}
      <Box sx={{ p: 3, border: `1px solid ${Theme.bronze[200]}`, borderRadius: 3 }}>
        <Typography variant="h6" sx={{
          fontWeight: 600, color: Theme.bronze[700], mb: 3,
          display: 'flex', alignItems: 'center', gap: 1,
        }}>
          <FaUsers /> Travelers
        </Typography>

        <FormControl fullWidth>
          <InputLabel sx={labelSx}>Number of Travelers</InputLabel>
          <Select
            value={totalTravelers.toString()}
            label="Number of Travelers"
            onChange={(e: SelectChangeEvent) => handleTravelerCountChange(e.target.value)}
            sx={selectSx}
          >
            {Array.from({ length: MAX_TRAVELERS }, (_, i) => i + 1).map(n => (
              <MenuItem key={n} value={n.toString()}>
                {n} {n === 1 ? 'Traveler' : 'Travelers'}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Main Traveler */}
      <TravelerForm
        traveler={formData.mainTraveler}
        isMain
        onChange={updateMainTraveler}
      />

      {/* Additional Travelers */}
      {formData.additionalTravelers.map((traveler, idx) => (
        <TravelerForm
          key={traveler.id}
          traveler={traveler}
          isMain={false}
          index={idx + 2}
          onChange={(field, value) => updateAdditionalTraveler(traveler.id, field, value)}
          onRemove={() => removeTraveler(traveler.id)}
        />
      ))}

      {/* Add Traveler Button */}
      {totalTravelers < MAX_TRAVELERS && (
        <Button
          variant="outlined"
          onClick={addTraveler}
          startIcon={<FaPlus />}
          sx={{
            alignSelf: 'center',
            px: 4, py: 1.5,
            borderRadius: 2,
            borderColor: Theme.bronze[400],
            color: Theme.bronze[700],
            fontWeight: 600,
            transition: 'all 0.3s',
            '&:hover': {
              borderColor: Theme.bronze[600],
              backgroundColor: Theme.bronze[50],
              transform: 'translateY(-2px)',
            },
          }}
        >
          Add Another Traveler
        </Button>
      )}

      {/* Info Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mt: 2 }}>
        {[
          {
            icon: <FaInfoCircle size={14} color={Theme.bronze[600]} />,
            bg: Theme.wheat[50],
            border: Theme.bronze[500],
            iconBg: Theme.bronze[100],
            title: 'Important Information',
            body: 'Please ensure all information matches your official ID/passport. Student discounts require valid student ID at check-in.',
          },
          {
            icon: <FaIdCard size={14} color={Theme['olive-wood'][600]} />,
            bg: Theme['olive-wood'][50],
            border: Theme['olive-wood'][500],
            iconBg: Theme['olive-wood'][100],
            title: 'Travel Requirements',
            body: 'All travelers must have valid ID/passport. International travelers should ensure passport validity of at least 6 months.',
          },
        ].map(({ icon, bg, border, iconBg, title, body }) => (
          <Box key={title} sx={{
            p: 2, backgroundColor: bg, borderRadius: 2,
            borderLeft: `4px solid ${border}`,
            display: 'flex', gap: 2, alignItems: 'flex-start',
          }}>
            <Box sx={{
              width: 32, height: 32, borderRadius: '50%',
              backgroundColor: iconBg, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {icon}
            </Box>
            <Box>
              <Typography sx={{ color: Theme['dark-khakhi'][700], fontSize: '14px', fontWeight: 600, mb: 0.5 }}>
                {title}
              </Typography>
              <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '12px', lineHeight: 1.5 }}>
                {body}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Status Banner + Submit */}
      <Box sx={{
        p: 2, borderRadius: 2, textAlign: 'center',
        backgroundColor: validation.isValid ? Theme['olive-wood'][50] : Theme.wheat[50],
        border: `1px solid ${validation.isValid ? Theme['olive-wood'][200] : Theme.bronze[200]}`,
      }}>
        <Typography sx={{
          color: validation.isValid ? Theme['olive-wood'][600] : Theme.bronze[600],
          fontSize: '14px',
          fontWeight: 500,
          mb: validation.isValid ? 2 : 0,
        }}>
          {validation.isValid
            ? '✓ All traveler information completed! Click Continue to proceed to summary.'
            : `⚠️ Please complete: ${validation.missing.join(', ')}`}
        </Typography>

        {validation.isValid && (
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              bgcolor: Theme.bronze[600],
              color: 'white',
              px: 5, py: 1.5,
              fontSize: '15px',
              fontWeight: 600,
              borderRadius: 2,
              '&:hover': { bgcolor: Theme.bronze[800] },
            }}
          >
            Continue to Summary
          </Button>
        )}
      </Box>
    </Box>
  );
}