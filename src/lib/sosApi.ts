// SOS API functions for Twilio integration and location sharing

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

// Mock SOS API functions (in a real app, these would connect to your backend)
export const sendSOSAlert = async (
  location: LocationData,
  emergencyContacts: EmergencyContact[],
  userId: string
): Promise<{ success: boolean; alertId: string; message: string }> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real implementation, this would:
    // 1. Send location to admin dashboard
    // 2. Send SMS to emergency contacts via Twilio
    // 3. Send push notifications
    // 4. Log the emergency in database

    const alertId = `sos_${Date.now()}`;
    
    // Mock sending SMS to emergency contacts
    const smsPromises = emergencyContacts.map(contact => 
      sendSMSToContact(contact.number, location, userId)
    );
    
    // Mock sending alert to admin
    const adminPromise = sendAlertToAdmin(location, userId);
    
    // Mock sending alert to emergency services
    const emergencyPromise = sendAlertToEmergencyServices(location, userId);
    
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

// Mock SMS sending function
const sendSMSToContact = async (
  phoneNumber: string, 
  location: LocationData, 
  userId: string
): Promise<void> => {
  // In a real implementation, this would use Twilio SMS API
  console.log(`SMS sent to ${phoneNumber}:`);
  console.log(`🚨 EMERGENCY ALERT 🚨`);
  console.log(`User ID: ${userId}`);
  console.log(`Location: ${location.latitude}, ${location.longitude}`);
  console.log(`Time: ${new Date(location.timestamp).toLocaleString()}`);
  console.log(`Google Maps: https://maps.google.com/?q=${location.latitude},${location.longitude}`);
  
  // Simulate Twilio API call
  await new Promise(resolve => setTimeout(resolve, 500));
};

// Mock admin notification function
const sendAlertToAdmin = async (
  location: LocationData, 
  userId: string
): Promise<void> => {
  // In a real implementation, this would:
  // 1. Send notification to admin dashboard
  // 2. Send email to admin
  // 3. Log in admin system
  
  console.log(`Admin Alert:`);
  console.log(`🚨 SOS ALERT RECEIVED 🚨`);
  console.log(`User ID: ${userId}`);
  console.log(`Location: ${location.latitude}, ${location.longitude}`);
  console.log(`Time: ${new Date(location.timestamp).toLocaleString()}`);
  console.log(`Accuracy: ${location.accuracy}m`);
  
  // Simulate admin notification
  await new Promise(resolve => setTimeout(resolve, 300));
};

// Mock emergency services notification
const sendAlertToEmergencyServices = async (
  location: LocationData, 
  userId: string
): Promise<void> => {
  // In a real implementation, this would:
  // 1. Send alert to local police
  // 2. Send alert to medical services
  // 3. Send alert to fire department
  
  console.log(`Emergency Services Alert:`);
  console.log(`🚨 EMERGENCY SOS ALERT 🚨`);
  console.log(`User ID: ${userId}`);
  console.log(`Location: ${location.latitude}, ${location.longitude}`);
  console.log(`Time: ${new Date(location.timestamp).toLocaleString()}`);
  console.log(`Google Maps: https://maps.google.com/?q=${location.latitude},${location.longitude}`);
  
  // Simulate emergency services notification
  await new Promise(resolve => setTimeout(resolve, 400));
};

// Get user's current location
export const getCurrentLocation = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

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
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

// Share location with contacts
export const shareLocationWithContacts = async (
  location: LocationData,
  contacts: EmergencyContact[]
): Promise<{ success: boolean; message: string }> => {
  try {
    // In a real implementation, this would use Twilio to send location
    const sharePromises = contacts.map(contact => 
      sendLocationToContact(contact.number, location)
    );
    
    await Promise.all(sharePromises);
    
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

// Mock location sharing function
const sendLocationToContact = async (
  phoneNumber: string,
  location: LocationData
): Promise<void> => {
  console.log(`Location shared with ${phoneNumber}:`);
  console.log(`📍 LOCATION UPDATE 📍`);
  console.log(`Location: ${location.latitude}, ${location.longitude}`);
  console.log(`Time: ${new Date(location.timestamp).toLocaleString()}`);
  console.log(`Google Maps: https://maps.google.com/?q=${location.latitude},${location.longitude}`);
  
  // Simulate location sharing
  await new Promise(resolve => setTimeout(resolve, 300));
};

// Get SOS alert history
export const getSOSHistory = async (userId: string): Promise<SOSAlert[]> => {
  // In a real implementation, this would fetch from database
  return [
    {
      id: 'sos_1234567890',
      userId,
      location: {
        latitude: 23.3441,
        longitude: 85.3096,
        accuracy: 10,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        address: 'Ranchi, Jharkhand'
      },
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'resolved',
      contactsNotified: ['+91 98765 43210', '+91 87654 32109'],
      adminNotified: true
    }
  ];
};

// Update SOS alert status
export const updateSOSStatus = async (
  alertId: string, 
  status: 'acknowledged' | 'resolved'
): Promise<{ success: boolean; message: string }> => {
  try {
    // In a real implementation, this would update database
    console.log(`SOS Alert ${alertId} status updated to: ${status}`);
    
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
