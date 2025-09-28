// Real SOS API with Twilio integration for production use

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
  address?: string;
}

export interface EmergencyContact {
  id: number;
  name: string;
  number: string;
  relationship: string;
}

export interface SOSAlert {
  id: string;
  userId: string;
  location: LocationData;
  timestamp: string;
  status: 'sent' | 'acknowledged' | 'resolved';
  contactsNotified: string[];
  adminNotified: boolean;
}

// Twilio Configuration (Replace with your actual Twilio credentials)
const TWILIO_CONFIG = {
  accountSid: process.env.REACT_APP_TWILIO_ACCOUNT_SID || 'your_account_sid',
  authToken: process.env.REACT_APP_TWILIO_AUTH_TOKEN || 'your_auth_token',
  fromNumber: process.env.REACT_APP_TWILIO_FROM_NUMBER || '+1234567890'
};

// Backend API endpoints
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://your-backend-api.com';

// Real SOS Alert function with Twilio integration
export const sendSOSAlert = async (
  location: LocationData,
  emergencyContacts: EmergencyContact[],
  userId: string
): Promise<{ success: boolean; alertId: string; message: string }> => {
  try {
    const alertId = `sos_${Date.now()}`;
    
    // Create SOS alert data
    const sosData = {
      id: alertId,
      userId,
      location,
      timestamp: new Date().toISOString(),
      contacts: emergencyContacts,
      status: 'sent'
    };

    // Send to backend API
    const response = await fetch(`${API_BASE_URL}/api/sos/alert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(sosData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    // Send SMS to emergency contacts via Twilio
    const smsPromises = emergencyContacts.map(contact => 
      sendSMSToContact(contact.number, location, userId, contact.name)
    );
    
    // Send alert to admin
    await sendAlertToAdmin(location, userId);
    
    // Send alert to emergency services
    await sendAlertToEmergencyServices(location, userId);
    
    // Wait for all SMS to be sent
    await Promise.all(smsPromises);
    
    return {
      success: true,
      alertId,
      message: 'SOS alert sent successfully to all contacts and emergency services'
    };
  } catch (error) {
    console.error('SOS Alert Error:', error);
    return {
      success: false,
      alertId: '',
      message: 'Failed to send SOS alert. Please try again.'
    };
  }
};

// Real Twilio SMS sending function
const sendSMSToContact = async (
  phoneNumber: string, 
  location: LocationData, 
  userId: string,
  contactName: string
): Promise<void> => {
  try {
    const googleMapsUrl = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
    const message = `🚨 EMERGENCY SOS ALERT 🚨

Contact: ${contactName}
User ID: ${userId}
Location: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}
Time: ${new Date(location.timestamp).toLocaleString()}
Accuracy: ±${Math.round(location.accuracy)}m

Google Maps: ${googleMapsUrl}

This is an automated emergency alert. Please respond immediately if you can help.`;

    const response = await fetch(`${API_BASE_URL}/api/sms/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify({
        to: phoneNumber,
        message: message,
        from: TWILIO_CONFIG.fromNumber
      })
    });

    if (!response.ok) {
      throw new Error(`SMS sending failed: ${response.status}`);
    }

    console.log(`SMS sent successfully to ${phoneNumber}`);
  } catch (error) {
    console.error(`Failed to send SMS to ${phoneNumber}:`, error);
    throw error;
  }
};

// Send alert to admin dashboard
const sendAlertToAdmin = async (
  location: LocationData, 
  userId: string
): Promise<void> => {
  try {
    const adminAlert = {
      type: 'SOS_ALERT',
      userId,
      location,
      timestamp: new Date().toISOString(),
      priority: 'HIGH',
      status: 'ACTIVE'
    };

    const response = await fetch(`${API_BASE_URL}/api/admin/alert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(adminAlert)
    });

    if (!response.ok) {
      throw new Error(`Admin alert failed: ${response.status}`);
    }

    console.log('Admin alert sent successfully');
  } catch (error) {
    console.error('Failed to send admin alert:', error);
    throw error;
  }
};

// Send alert to emergency services
const sendAlertToEmergencyServices = async (
  location: LocationData, 
  userId: string
): Promise<void> => {
  try {
    const emergencyAlert = {
      type: 'SOS_EMERGENCY',
      userId,
      location,
      timestamp: new Date().toISOString(),
      priority: 'CRITICAL',
      services: ['POLICE', 'MEDICAL', 'FIRE']
    };

    const response = await fetch(`${API_BASE_URL}/api/emergency/alert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(emergencyAlert)
    });

    if (!response.ok) {
      throw new Error(`Emergency services alert failed: ${response.status}`);
    }

    console.log('Emergency services alert sent successfully');
  } catch (error) {
    console.error('Failed to send emergency services alert:', error);
    throw error;
  }
};

// Get user's current location with better error handling
export const getCurrentLocation = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString()
        };
        resolve(location);
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        reject(new Error(errorMessage));
      },
      options
    );
  });
};

// Share location with contacts
export const shareLocationWithContacts = async (
  location: LocationData,
  contacts: EmergencyContact[]
): Promise<{ success: boolean; message: string }> => {
  try {
    const shareData = {
      location,
      contacts: contacts.map(c => ({ number: c.number, name: c.name })),
      timestamp: new Date().toISOString()
    };

    const response = await fetch(`${API_BASE_URL}/api/location/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(shareData)
    });

    if (!response.ok) {
      throw new Error(`Location sharing failed: ${response.status}`);
    }

    return {
      success: true,
      message: 'Location shared successfully with all contacts'
    };
  } catch (error) {
    console.error('Location sharing error:', error);
    return {
      success: false,
      message: 'Failed to share location. Please try again.'
    };
  }
};

// Get SOS alert history
export const getSOSHistory = async (userId: string): Promise<SOSAlert[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sos/history/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch SOS history: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch SOS history:', error);
    return [];
  }
};

// Update SOS alert status
export const updateSOSStatus = async (
  alertId: string, 
  status: 'acknowledged' | 'resolved'
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sos/status/${alertId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      throw new Error(`Status update failed: ${response.status}`);
    }

    return {
      success: true,
      message: `SOS alert status updated to ${status}`
    };
  } catch (error) {
    console.error('Update SOS status error:', error);
    return {
      success: false,
      message: 'Failed to update SOS status'
    };
  }
};

// Fallback for development (when backend is not available)
export const sendSOSAlertFallback = async (
  location: LocationData,
  emergencyContacts: EmergencyContact[],
  userId: string
): Promise<{ success: boolean; alertId: string; message: string }> => {
  try {
    const alertId = `sos_${Date.now()}`;
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock sending SMS to emergency contacts
    const smsPromises = emergencyContacts.map(contact => 
      sendSMSToContactFallback(contact.number, location, userId, contact.name)
    );
    
    // Mock sending alert to admin
    const adminPromise = sendAlertToAdminFallback(location, userId);
    
    // Mock sending alert to emergency services
    const emergencyPromise = sendAlertToEmergencyServicesFallback(location, userId);
    
    await Promise.all([...smsPromises, adminPromise, emergencyPromise]);
    
    return {
      success: true,
      alertId,
      message: 'SOS alert sent successfully to all contacts and emergency services'
    };
  } catch (error) {
    console.error('SOS Alert Error:', error);
    return {
      success: false,
      alertId: '',
      message: 'Failed to send SOS alert. Please try again.'
    };
  }
};

// Fallback SMS function for development
const sendSMSToContactFallback = async (
  phoneNumber: string, 
  location: LocationData, 
  userId: string,
  contactName: string
): Promise<void> => {
  const googleMapsUrl = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
  const message = `🚨 EMERGENCY SOS ALERT 🚨

Contact: ${contactName}
User ID: ${userId}
Location: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}
Time: ${new Date(location.timestamp).toLocaleString()}
Accuracy: ±${Math.round(location.accuracy)}m

Google Maps: ${googleMapsUrl}

This is an automated emergency alert. Please respond immediately if you can help.`;

  console.log(`SMS would be sent to ${phoneNumber}:`);
  console.log(message);
  
  // Simulate SMS sending
  await new Promise(resolve => setTimeout(resolve, 500));
};

// Fallback admin alert function
const sendAlertToAdminFallback = async (
  location: LocationData, 
  userId: string
): Promise<void> => {
  console.log(`Admin Alert (Fallback):`);
  console.log(`🚨 SOS ALERT RECEIVED 🚨`);
  console.log(`User ID: ${userId}`);
  console.log(`Location: ${location.latitude}, ${location.longitude}`);
  console.log(`Time: ${new Date(location.timestamp).toLocaleString()}`);
  console.log(`Accuracy: ${location.accuracy}m`);
  
  await new Promise(resolve => setTimeout(resolve, 300));
};

// Fallback emergency services alert
const sendAlertToEmergencyServicesFallback = async (
  location: LocationData, 
  userId: string
): Promise<void> => {
  console.log(`Emergency Services Alert (Fallback):`);
  console.log(`🚨 EMERGENCY SOS ALERT 🚨`);
  console.log(`User ID: ${userId}`);
  console.log(`Location: ${location.latitude}, ${location.longitude}`);
  console.log(`Time: ${new Date(location.timestamp).toLocaleString()}`);
  console.log(`Google Maps: https://maps.google.com/?q=${location.latitude},${location.longitude}`);
  
  await new Promise(resolve => setTimeout(resolve, 400));
};
