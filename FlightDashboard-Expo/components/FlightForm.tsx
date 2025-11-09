import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  Platform 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Flights, Airlines, Routes, Aircrafts, Airports } from '../services/api';

interface FlightFormProps {
  flight?: Flights;
  airlines: Airlines[];
  routes: Routes[];
  aircrafts: Aircrafts[];
  airports: Airports[];
  onSubmit: (data: Omit<Flights, 'id'>) => void;
  onCancel: () => void;
}

export const FlightForm: React.FC<FlightFormProps> = ({
  flight,
  airlines,
  routes,
  aircrafts,
  airports,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    flight_number: flight?.flight_number || '',
    departure_time: flight ? new Date(flight.departure_time) : new Date(),
    arrival_time: flight ? new Date(flight.arrival_time) : new Date(Date.now() + 2 * 60 * 60 * 1000),
    status: flight?.status || 'Scheduled',
    airline: flight?.airline.toString() || '',
    route: flight?.route.toString() || '',
    aircraft: flight?.aircraft?.toString() || '',
  });

  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [showArrivalPicker, setShowArrivalPicker] = useState(false);

  useEffect(() => {
    if (formData.arrival_time <= formData.departure_time) {
      const newArrivalTime = new Date(formData.departure_time.getTime() + 2 * 60 * 60 * 1000);
      setFormData(prev => ({ ...prev, arrival_time: newArrivalTime }));
    }
  }, [formData.departure_time]);

  const handleSubmit = () => {
    if (!formData.flight_number.trim()) {
      Alert.alert('Kļūda', 'Lūdzu ievadiet lidojuma numuru');
      return;
    }

    if (!formData.airline) {
      Alert.alert('Kļūda', 'Lūdzu izvēlieties aviokompāniju');
      return;
    }

    if (!formData.route) {
      Alert.alert('Kļūda', 'Lūdzu izvēlieties maršrutu');
      return;
    }

    if (formData.arrival_time <= formData.departure_time) {
      Alert.alert('Kļūda', 'Ielidošanas laikam jābūt pēc izlidošanas laika');
      return;
    }

    const submitData: Omit<Flights, 'id'> = {
      flight_number: formData.flight_number.trim().toUpperCase(),
      departure_time: formData.departure_time.toISOString(),
      arrival_time: formData.arrival_time.toISOString(),
      status: formData.status,
      airline: parseInt(formData.airline),
      route: parseInt(formData.route),
      aircraft: formData.aircraft ? parseInt(formData.aircraft) : null,
    };

    onSubmit(submitData);
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('lv-LV', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAirlineName = (airlineId: string) => {
    const airline = airlines.find(a => a.id.toString() === airlineId);
    return airline ? `${airline.name} (ID: ${airline.id})` : 'Izvēlieties aviokompāniju';
  };

  const getRouteInfo = (routeId: string) => {
    const route = routes.find(r => r.id.toString() === routeId);
    if (route && route.departure_airport_details && route.arrival_airport_details) {
      const dep = route.departure_airport_details;
      const arr = route.arrival_airport_details;
      return `${dep.city} (${dep.country}) → ${arr.city} (${arr.country})`;
    }
    return `Maršruts ${routeId}`;
  };

  const getAircraftModel = (aircraftId: string) => {
    const aircraft = aircrafts.find(a => a.id.toString() === aircraftId);
    return aircraft ? `${aircraft.model} (ID: ${aircraft.id})` : 'Nav izvēlēts';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Lidojuma numurs */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Lidojuma numurs *</Text>
        <TextInput
          style={styles.input}
          placeholder="PIEM., BT123, LH456"
          value={formData.flight_number}
          onChangeText={(text) => setFormData({ ...formData, flight_number: text })}
          maxLength={10}
          autoCapitalize="characters"
        />
      </View>

      {/* Izlidošanas laiks */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Izlidošanas laiks *</Text>
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => setShowDeparturePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            🛫 {formatDateTime(formData.departure_time)}
          </Text>
        </TouchableOpacity>
        {showDeparturePicker && (
          <DateTimePicker
            value={formData.departure_time}
            mode="datetime"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => {
              setShowDeparturePicker(false);
              if (date) {
                setFormData({ ...formData, departure_time: date });
              }
            }}
          />
        )}
      </View>

      {/* Ielidošanas laiks */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Ielidošanas laiks *</Text>
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => setShowArrivalPicker(true)}
        >
          <Text style={styles.dateButtonText}>
            🛬 {formatDateTime(formData.arrival_time)}
          </Text>
        </TouchableOpacity>
        {showArrivalPicker && (
          <DateTimePicker
            value={formData.arrival_time}
            mode="datetime"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => {
              setShowArrivalPicker(false);
              if (date) {
                setFormData({ ...formData, arrival_time: date });
              }
            }}
          />
        )}
      </View>

      {/* Statuss */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Statuss *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
            style={styles.picker}
          >
            <Picker.Item label="Scheduled" value="Scheduled" />
            <Picker.Item label="Delayed" value="Delayed" />
            <Picker.Item label="Departed" value="Departed" />
            <Picker.Item label="Landed" value="Landed" />
            <Picker.Item label="Cancelled" value="Cancelled" />
            <Picker.Item label="Boarding" value="Boarding" />
            <Picker.Item label="In Flight" value="In Flight" />
          </Picker>
        </View>
      </View>

      {/* Aviokompānija */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Aviokompānija *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.airline}
            onValueChange={(value) => setFormData({ ...formData, airline: value })}
            style={styles.picker}
          >
            <Picker.Item label="Izvēlieties aviokompāniju" value="" />
            {airlines.map(airline => (
              <Picker.Item 
                key={airline.id} 
                label={`${airline.name} (ID: ${airline.id})`} 
                value={airline.id.toString()} 
              />
            ))}
          </Picker>
        </View>
        {formData.airline && (
          <Text style={styles.selectedValue}>
            Izvēlēts: {getAirlineName(formData.airline)}
          </Text>
        )}
      </View>

      {/* Maršruts */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Maršruts *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.route}
            onValueChange={(value) => setFormData({ ...formData, route: value })}
            style={styles.picker}
          >
            <Picker.Item label="Izvēlieties maršrutu" value="" />
            {routes.map(route => (
              <Picker.Item 
                key={route.id} 
                label={getRouteInfo(route.id.toString())} 
                value={route.id.toString()} 
              />
            ))}
          </Picker>
        </View>
        {formData.route && (
          <Text style={styles.selectedValue}>
            Izvēlēts: {getRouteInfo(formData.route)}
          </Text>
        )}
      </View>

      {/* Lidmašīna */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Lidmašīna</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.aircraft}
            onValueChange={(value) => setFormData({ ...formData, aircraft: value })}
            style={styles.picker}
          >
            <Picker.Item label="Nav izvēlēts" value="" />
            {aircrafts.map(aircraft => (
              <Picker.Item 
                key={aircraft.id} 
                label={`${aircraft.model} (ID: ${aircraft.id})`} 
                value={aircraft.id.toString()} 
              />
            ))}
          </Picker>
        </View>
        {formData.aircraft && (
          <Text style={styles.selectedValue}>
            Izvēlēts: {getAircraftModel(formData.aircraft)}
          </Text>
        )}
      </View>

      {/* Pogas */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>❌ Atcelt</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            {flight ? '💾 Saglabāt' : '✅ Izveidot'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Informācija */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
           * obligāti aizpildāmi lauki
        </Text>
        <Text style={styles.infoText}>
           Lidojuma ilgums: {Math.round(
            (formData.arrival_time.getTime() - formData.departure_time.getTime()) / (1000 * 60)
          )} minūtes
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2c3e50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#495057',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  selectedValue: {
    marginTop: 4,
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#6c757d',
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  submitButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#28a745',
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoBox: {
    backgroundColor: '#e7f3ff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  infoText: {
    fontSize: 12,
    color: '#0056b3',
    marginBottom: 4,
  },
});