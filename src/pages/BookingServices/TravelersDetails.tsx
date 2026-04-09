// TravelerDetails.tsx - Step 3
import {
  Box, Typography, TextField, MenuItem, FormControl,
  InputLabel, Select, IconButton, Button,
  InputAdornment,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  FaUser, FaEnvelope, FaPhone, FaIdCard, FaVenusMars,
  FaGraduationCap, FaPlus, FaTrash, FaUsers,
  FaGlobe, FaCalendar,
} from 'react-icons/fa6';
import { FaInfoCircle, FaFileAlt } from 'react-icons/fa';
import { Theme } from '@/assets/constants/colors';
import { useState, useMemo, useCallback } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────────
// Mirrors ITraveler from the backend exactly.
// `age` is derived from `dateOfBirth` — never stored separately.

export type Gender   = 'male' | 'female' | 'other' | 'prefer-not-to-say';
export type IdType   = 'passport' | 'national-id' | 'driver-license';

export interface Traveler {
  id: string;           // local form key only — not sent to backend
  fullName: string;
  dateOfBirth: string;  // ISO string — backend converts to Date
  gender: Gender | '';
  nationality: string;
  idType: IdType | '';
  idNumber: string;
  isStudent: boolean;
  schoolName: string;
}

export interface TravelerInfo {
  email: string;
  phone: string;
  specialRequest: string;   // one per booking, not per traveler
  mainTraveler: Traveler;
  additionalTravelers: Traveler[];
}

interface TravelerDetailsProps {
  onTravelerInfoSubmit?: (travelerInfo: TravelerInfo) => void;
  initialData?: TravelerInfo | null;
}

// ─── ID type config ────────────────────────────────────────────────────────────
// Add new doc types here — dropdown and placeholder update automatically.

const ID_TYPES: { value: IdType; label: string; placeholder: string }[] = [
  { value: 'passport',        label: 'Passport',         placeholder: 'e.g. A12345678' },
  { value: 'national-id',     label: 'National ID',      placeholder: 'e.g. 123456/78/1' },
  { value: 'driver-license',  label: "Driver's Licence", placeholder: 'e.g. DL-123456' },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

const emptyTraveler = (id = 'main'): Traveler => ({
  id,
  fullName: '',
  dateOfBirth: '',
  gender: '',
  nationality: '',
  idType: '',
  idNumber: '',
  isStudent: false,
  schoolName: '',
});

/** Derive age from ISO date string — keeps it in sync with DOB automatically */
function ageFromDOB(dob: string): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

/** Max date for the DOB picker — today */
const TODAY_ISO = new Date().toISOString().split('T')[0];

/** Earliest allowed DOB — 120 years ago */
const MIN_DOB = new Date(new Date().getFullYear() - 120, 0, 1).toISOString().split('T')[0];

const isTravelerValid = (t: Traveler) =>
  Boolean(t.fullName && t.dateOfBirth && t.gender && t.nationality && t.idType && t.idNumber);

const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isPhoneValid = (phone: string) => phone.length >= 10;

// ─── Shared styles ─────────────────────────────────────────────────────────────

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

const iconStyle = { color: Theme.bronze[500] };

// ─── TravelerForm sub-component ────────────────────────────────────────────────

interface TravelerFormProps {
  traveler: Traveler;
  isMain: boolean;
  index?: number;
  onChange: (field: keyof Traveler, value: string | boolean) => void;
  onRemove?: () => void;
}

function TravelerForm({ traveler, isMain, index, onChange, onRemove }: TravelerFormProps) {
  const derivedAge  = ageFromDOB(traveler.dateOfBirth);
  const idConfig    = ID_TYPES.find(t => t.value === traveler.idType);

  return (
    <Box sx={{
      p: 3, mb: 3,
      border: `1px solid ${Theme.bronze[200]}`,
      borderRadius: 3,
      backgroundColor: isMain ? Theme.wheat[50] : 'white',
    }}>
      {/* ── Header ── */}
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        mb: 3, pb: 2, borderBottom: `2px solid ${Theme.bronze[200]}`,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: '50%',
            backgroundColor: Theme.bronze[100],
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FaUsers size={20} color={Theme.bronze[600]} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: Theme.bronze[700], lineHeight: 1.2 }}>
              {isMain ? 'Main Traveler' : `Traveler ${index}`}
            </Typography>
            {derivedAge !== null && (
              <Typography sx={{ color: Theme['dark-khakhi'][500], fontSize: '12px' }}>
                Age: {derivedAge} years old
              </Typography>
            )}
          </Box>
        </Box>
        {!isMain && onRemove && (
          <IconButton
            onClick={onRemove}
            aria-label="Remove traveler"
            sx={{ color: Theme.bronze[600], '&:hover': { backgroundColor: Theme.bronze[100], color: Theme.bronze[800] } }}
          >
            <FaTrash />
          </IconButton>
        )}
      </Box>

      {/* ── Section: Personal Details ── */}
      <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', mb: 2 }}>
        Personal Details
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3, mb: 3 }}>

        <TextField
          fullWidth required
          label="Full Name"
          placeholder="As it appears on your ID"
          value={traveler.fullName}
          onChange={(e) => onChange('fullName', e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><FaUser style={iconStyle} /></InputAdornment> }}
          sx={fieldSx}
        />

        {/* Date of Birth — age auto-derived, not a separate input */}
        <TextField
          fullWidth required
          label="Date of Birth"
          type="date"
          value={traveler.dateOfBirth}
          onChange={(e) => onChange('dateOfBirth', e.target.value)}
          inputProps={{ max: TODAY_ISO, min: MIN_DOB }}
          InputLabelProps={{ shrink: true }}
          InputProps={{ startAdornment: <InputAdornment position="start"><FaCalendar style={iconStyle} /></InputAdornment> }}
          sx={fieldSx}
        />

        <FormControl fullWidth required>
          <InputLabel sx={labelSx}>Gender</InputLabel>
          <Select
            value={traveler.gender}
            label="Gender"
            onChange={(e: SelectChangeEvent) => onChange('gender', e.target.value)}
            startAdornment={<InputAdornment position="start"><FaVenusMars style={iconStyle} /></InputAdornment>}
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
          label="Nationality"
          placeholder="e.g. Zambian"
          value={traveler.nationality}
          onChange={(e) => onChange('nationality', e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><FaGlobe style={iconStyle} /></InputAdornment> }}
          sx={{ ...fieldSx, gridColumn: { xs: 'span 1', sm: 'span 2', md: 'span 1' } }}
        />
      </Box>

      {/* ── Section: Identity Document ── */}
      <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', mb: 2 }}>
        Identity Document
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3, mb: 3 }}>

        {/* ID type selector */}
        <FormControl fullWidth required>
          <InputLabel sx={labelSx}>Document Type</InputLabel>
          <Select
            value={traveler.idType}
            label="Document Type"
            onChange={(e: SelectChangeEvent) => {
              onChange('idType', e.target.value);
              onChange('idNumber', ''); // clear number when type changes
            }}
            startAdornment={<InputAdornment position="start"><FaFileAlt style={iconStyle} /></InputAdornment>}
            sx={selectSx}
          >
            {ID_TYPES.map(({ value, label }) => (
              <MenuItem key={value} value={value}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* ID number — placeholder adapts to selected type */}
        <TextField
          fullWidth required
          label={idConfig ? `${idConfig.label} Number` : 'Document Number'}
          placeholder={idConfig?.placeholder ?? 'Select document type first'}
          value={traveler.idNumber}
          onChange={(e) => onChange('idNumber', e.target.value)}
          disabled={!traveler.idType}
          InputProps={{ startAdornment: <InputAdornment position="start"><FaIdCard style={iconStyle} /></InputAdornment> }}
          sx={fieldSx}
        />
      </Box>

      {/* ── Section: Student Status ── */}
      <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', mb: 2 }}>
        Student Status
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3 }}>

        <FormControl fullWidth>
          <InputLabel sx={labelSx}>Are you a student? (Optional)</InputLabel>
          <Select
            value={traveler.isStudent ? 'yes' : 'no'}
            label="Are you a student? (Optional)"
            onChange={(e: SelectChangeEvent) => {
              const student = e.target.value === 'yes';
              onChange('isStudent', student);
              if (!student) onChange('schoolName', '');
            }}
            startAdornment={<InputAdornment position="start"><FaGraduationCap style={iconStyle} /></InputAdornment>}
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
            placeholder="Enter your institution's name"
            value={traveler.schoolName}
            onChange={(e) => onChange('schoolName', e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><FaGraduationCap style={iconStyle} /></InputAdornment> }}
            sx={fieldSx}
          />
        )}
      </Box>
    </Box>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

const MAX_TRAVELERS = 6;

export default function TravelerDetails({ onTravelerInfoSubmit, initialData }: TravelerDetailsProps) {
  const [formData, setFormData] = useState<TravelerInfo>(() => ({
    email:                initialData?.email                ?? '',
    phone:                initialData?.phone                ?? '',
    specialRequest:       initialData?.specialRequest       ?? '',
    mainTraveler:         initialData?.mainTraveler         ?? emptyTraveler('main'),
    additionalTravelers:  initialData?.additionalTravelers  ?? [],
  }));

  const totalTravelers = formData.additionalTravelers.length + 1;

  // ── Validation ───────────────────────────────────────────────────────────────

  const validation = useMemo(() => {
    const mainValid  = isTravelerValid(formData.mainTraveler);
    const addlValid  = formData.additionalTravelers.every(isTravelerValid);
    const emailOk    = isEmailValid(formData.email);
    const phoneOk    = isPhoneValid(formData.phone);
    const isValid    = mainValid && addlValid && emailOk && phoneOk;

    const missing: string[] = [];
    if (!emailOk)                              missing.push('valid email');
    if (!phoneOk)                              missing.push('valid phone');
    if (!formData.mainTraveler.fullName)       missing.push('main traveler name');
    if (!formData.mainTraveler.dateOfBirth)    missing.push('date of birth');
    if (!formData.mainTraveler.gender)         missing.push('gender');
    if (!formData.mainTraveler.nationality)    missing.push('nationality');
    if (!formData.mainTraveler.idType)         missing.push('document type');
    if (!formData.mainTraveler.idNumber)       missing.push('document number');
    if (!addlValid && formData.additionalTravelers.length)
      missing.push('all additional traveler details');

    return { isValid, missing };
  }, [formData]);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const updateMainTraveler = useCallback((field: keyof Traveler, value: string | boolean) => {
    setFormData(prev => ({ ...prev, mainTraveler: { ...prev.mainTraveler, [field]: value } }));
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
      additionalTravelers: [
        ...prev.additionalTravelers,
        emptyTraveler(`${Date.now()}-${Math.random()}`),
      ],
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
      const newOnes = Array.from({ length: delta }, () =>
        emptyTraveler(`${Date.now()}-${Math.random()}`)
      );
      setFormData(prev => ({ ...prev, additionalTravelers: [...prev.additionalTravelers, ...newOnes] }));
    } else if (delta < 0) {
      setFormData(prev => ({ ...prev, additionalTravelers: prev.additionalTravelers.slice(0, target - 1) }));
    }
  }, [totalTravelers]);

  const handleSubmit = () => {
    if (validation.isValid) onTravelerInfoSubmit?.(formData);
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3, p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
      <Box>
        <Typography variant="h4" sx={{ color: Theme.bronze[700], fontWeight: 600, mb: 1 }}>
          Traveler Information
        </Typography>
        <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '16px' }}>
          Please provide details for all travelers
        </Typography>
      </Box>

      {/* ── Contact Information ── */}
      <Box sx={{ p: 3, border: `1px solid ${Theme.bronze[200]}`, borderRadius: 3, backgroundColor: Theme.wheat[50] }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: Theme.bronze[700], mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
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
            InputProps={{ startAdornment: <InputAdornment position="start"><FaEnvelope style={iconStyle} /></InputAdornment> }}
            sx={fieldSx}
          />
          <TextField
            fullWidth required
            label="Phone Number"
            placeholder="+260 97 XXX XXXX"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            error={formData.phone !== '' && !isPhoneValid(formData.phone)}
            helperText={formData.phone !== '' && !isPhoneValid(formData.phone) ? 'Please enter a valid phone number (at least 10 digits)' : ''}
            InputProps={{ startAdornment: <InputAdornment position="start"><FaPhone style={iconStyle} /></InputAdornment> }}
            sx={fieldSx}
          />
        </Box>
      </Box>

      {/* ── Special Requests ── */}
      <Box sx={{ p: 3, border: `1px solid ${Theme.bronze[200]}`, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: Theme.bronze[700], mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <FaFileAlt /> Special Requests
        </Typography>
        <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '13px', mb: 2 }}>
          Optional — dietary requirements, accessibility needs, celebration arrangements, etc.
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Special Requests (Optional)"
          placeholder="E.g. vegetarian meals, wheelchair access, anniversary celebration..."
          value={formData.specialRequest}
          onChange={(e) => setFormData(prev => ({ ...prev, specialRequest: e.target.value }))}
          sx={fieldSx}
        />
      </Box>

      {/* ── Traveler Count ── */}
      <Box sx={{ p: 3, border: `1px solid ${Theme.bronze[200]}`, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: Theme.bronze[700], mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <FaUsers /> Number of Travelers
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

      {/* ── Traveler Forms ── */}
      <TravelerForm
        traveler={formData.mainTraveler}
        isMain
        onChange={updateMainTraveler}
      />

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

      {/* ── Add Traveler Button ── */}
      {totalTravelers < MAX_TRAVELERS && (
        <Button
          variant="outlined"
          onClick={addTraveler}
          startIcon={<FaPlus />}
          sx={{
            alignSelf: 'center', px: 4, py: 1.5, borderRadius: 2,
            borderColor: Theme.bronze[400], color: Theme.bronze[700], fontWeight: 600,
            transition: 'all 0.3s',
            '&:hover': { borderColor: Theme.bronze[600], backgroundColor: Theme.bronze[50], transform: 'translateY(-2px)' },
          }}
        >
          Add Another Traveler
        </Button>
      )}

      {/* ── Info Cards ── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mt: 2 }}>
        {[
          {
            icon: <FaInfoCircle size={14} color={Theme.bronze[600]} />,
            bg: Theme.wheat[50], border: Theme.bronze[500], iconBg: Theme.bronze[100],
            title: 'Name must match your ID',
            body: 'Please enter your full name exactly as it appears on your official document. Mismatches may cause issues at check-in.',
          },
          {
            icon: <FaIdCard size={14} color={Theme['olive-wood'][600]} />,
            bg: Theme['olive-wood'][50], border: Theme['olive-wood'][500], iconBg: Theme['olive-wood'][100],
            title: 'Passport validity',
            body: 'International travelers should ensure their passport is valid for at least 6 months beyond their travel dates.',
          },
        ].map(({ icon, bg, border, iconBg, title, body }) => (
          <Box key={title} sx={{ p: 2, backgroundColor: bg, borderRadius: 2, borderLeft: `4px solid ${border}`, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box sx={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: iconBg, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {icon}
            </Box>
            <Box>
              <Typography sx={{ color: Theme['dark-khakhi'][700], fontSize: '14px', fontWeight: 600, mb: 0.5 }}>{title}</Typography>
              <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '12px', lineHeight: 1.5 }}>{body}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* ── Status Banner + Submit ── */}
      <Box sx={{
        p: 2.5, borderRadius: 2, textAlign: 'center',
        backgroundColor: validation.isValid ? Theme['olive-wood'][50] : Theme.wheat[50],
        border: `1px solid ${validation.isValid ? Theme['olive-wood'][200] : Theme.bronze[200]}`,
      }}>
        <Typography sx={{
          color: validation.isValid ? Theme['olive-wood'][600] : Theme.bronze[600],
          fontSize: '14px', fontWeight: 500,
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
              bgcolor: Theme.bronze[600], color: 'white',
              px: 5, py: 1.5, fontSize: '15px', fontWeight: 600, borderRadius: 2,
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