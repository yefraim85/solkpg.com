import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

export const SUPABASE_URL = 'https://ksneftciffbvrkgiznpr.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzbmVmdGNpZmZidnJrZ2l6bnByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyMTI1NzAsImV4cCI6MjEwMDc4ODU3MH0.2EWxMGC3cIQvA8hL7mHSHZYTiLxXnPKW_BTYEG8rAVk';

export function createSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Same list as the internal app's nationality field (customer_screen.dart) -- kept in sync so both surfaces offer
// identical options.
export const NATIONALITIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia','Australia',
  'Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin',
  'Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi',
  'Cabo Verde','Cambodia','Cameroon','Canada','Central African Republic','Chad','Chile','China','Colombia',
  'Comoros','Congo','Costa Rica','Croatia','Cuba','Cyprus','Czech Republic','Democratic Republic of the Congo',
  'Denmark','Djibouti','Dominica','Dominican Republic','Ecuador','Egypt','El Salvador','Equatorial Guinea',
  'Eritrea','Estonia','Eswatini','Ethiopia','Fiji','Finland','France','Gabon','Gambia','Georgia','Germany',
  'Ghana','Greece','Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana','Haiti','Honduras','Hungary',
  'Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Ivory Coast','Jamaica','Japan',
  'Jordan','Kazakhstan','Kenya','Kiribati','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia',
  'Libya','Liechtenstein','Lithuania','Luxembourg','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta',
  'Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia','Moldova','Monaco','Mongolia','Montenegro',
  'Morocco','Mozambique','Myanmar','Namibia','Nauru','Nepal','Netherlands','New Zealand','Nicaragua','Niger',
  'Nigeria','North Korea','North Macedonia','Norway','Oman','Pakistan','Palau','Palestine','Panama',
  'Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Qatar','Romania','Russia','Rwanda',
  'Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Samoa','San Marino',
  'Sao Tome and Principe','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia',
  'Slovenia','Solomon Islands','Somalia','South Africa','South Korea','South Sudan','Spain','Sri Lanka','Sudan',
  'Suriname','Sweden','Switzerland','Syria','Tajikistan','Tanzania','Thailand','Timor-Leste','Togo','Tonga',
  'Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu','Uganda','Ukraine','United Arab Emirates',
  'United Kingdom','United States','Uruguay','Uzbekistan','Vanuatu','Vatican City','Venezuela','Vietnam',
  'Yemen','Zambia','Zimbabwe','Other',
];

export const EMERGENCY_RELATIONS = ['Spouse', 'Partner', 'Friend', 'Parent', 'Sibling', "Parent's Sibling", 'Child', 'Other'];

export function populateSelect(select, options) {
  for (const value of options) {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = value;
    select.appendChild(opt);
  }
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatPrice(price) {
  const n = Number(price);
  return isNaN(n) ? '' : `฿ ${n.toLocaleString()}`;
}

export function normalizePhoneNumber(value) {
  return value.trim().replace(/\s+/g, '');
}

// Keeps the "Same as WhatsApp number" checkbox and the phone field in sync both ways: checking it mirrors
// WhatsApp into phone and locks phone; typing a phone value that happens to match WhatsApp checks it (and locks
// it) the same way manually checking the box would. Returns the sync function so a caller can also run it once
// right after pre-filling both fields from saved data.
export function wireSamePhoneCheckbox(els) {
  function syncFromValues() {
    const whatsapp = els.whatsapp.value.trim();
    const same = whatsapp !== '' && whatsapp === els.phone.value.trim();
    els.samePhone.checked = same;
    els.phone.disabled = same;
  }

  els.samePhone.addEventListener('change', () => {
    if (els.samePhone.checked) {
      els.phone.value = els.whatsapp.value;
      els.phone.disabled = true;
    } else {
      els.phone.disabled = false;
    }
  });
  els.whatsapp.addEventListener('input', () => {
    if (els.samePhone.checked) {
      els.phone.value = els.whatsapp.value;
    } else {
      syncFromValues();
    }
  });
  els.phone.addEventListener('input', syncFromValues);

  return syncFromValues;
}

// Wires the shared "sign in with Google" gate: hides/shows the sign-in button vs. the (disabled-until-signed-in)
// form fieldset, and delegates to the page's own callbacks once a session is known. Returns an init function the
// page must await once at startup, to handle the case of already having a session (e.g. on the redirect back from
// Google, or a returning visit within the same browser).
export function wireAuthGate(supabase, els, { onSignedIn, onSignedOut } = {}) {
  function showSignedOut() {
    els.signInGate.classList.remove('hidden');
    els.signedInRow.classList.add('hidden');
    els.formFieldset.classList.add('hidden');
    els.formFieldset.disabled = true;
    onSignedOut?.();
  }

  async function handleSignedIn(session) {
    els.signInGate.classList.add('hidden');
    els.signedInRow.classList.remove('hidden');
    els.signedInEmail.textContent = session.user.email;
    els.formFieldset.classList.remove('hidden');
    els.formFieldset.disabled = false;
    await onSignedIn?.(session);
  }

  els.signInButton.addEventListener('click', async () => {
    // Deliberately excludes location.hash: after a sign-in, the hash can be left as a stray empty "#" rather than
    // fully cleared, and reusing window.location.href verbatim as redirectTo would then have Supabase append its
    // own "#access_token=..." fragment onto a URL that already ends in "#" -- producing "##access_token=...",
    // which the browser percent-encodes the second "#" of, corrupting the fragment so it can never be parsed back
    // out on return. A clean, hash-free redirect URL sidesteps this entirely.
    const redirectTo = `${window.location.origin}${window.location.pathname}${window.location.search}`;
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
  });

  els.signOutButton.addEventListener('click', async () => {
    await supabase.auth.signOut();
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      handleSignedIn(session);
    } else {
      showSignedOut();
    }
  });

  return async function initAuthGate() {
    const { data: { session } } = await supabase.auth.getSession();
    // Strips any leftover URL hash (the OAuth token fragment, or a stray empty "#") now that it's been read, so
    // it can never carry forward into a later redirectTo and corrupt a subsequent sign-in.
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    if (session) await handleSignedIn(session);
  };
}
