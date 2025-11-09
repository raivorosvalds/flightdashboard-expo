import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Flights, Airlines, Routes, Aircrafts, Airports, fetchFlights, fetchAirlines, fetchRoutes, fetchAircrafts, fetchAirports, createFlight, updateFlight, deleteFlight } from '../../services/api';
import { FlightForm } from '../../components/FlightForm';
import { RefreshControl } from 'react-native';

type Operation = 'create' | 'update' | 'delete' | null;

export default function FlightManager() {
  const [flights, setFlights] = useState<Flights[]>([]);
  const [airlines, setAirlines] = useState<Airlines[]>([]);
  const [routes, setRoutes] = useState<Routes[]>([]);
  const [aircrafts, setAircrafts] = useState<Aircrafts[]>([]);
  const [airports, setAirports] = useState<Airports[]>([]); 
  const [selectedOperation, setSelectedOperation] = useState<Operation>(null);
  const [selectedFlightId, setSelectedFlightId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [flightsData, airlinesData, routesData, aircraftsData] = await Promise.all([
        fetchFlights(),
        fetchAirlines(),
        fetchRoutes(),
        fetchAircrafts(),
        fetchAirports()
      ]);
      setFlights(flightsData);
      setAirlines(airlinesData);
      setRoutes(routesData);
      setAircrafts(aircraftsData);
    } catch (error) {
      Alert.alert('Kļūda', 'Neizdevās ielādēt datus');
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleCreate = async (flightData: Omit<Flights, 'id'>) => {
    try {
      await createFlight(flightData);
      Alert.alert('Veiksmīgi', 'Lidojums izveidots');
      setSelectedOperation(null);
      await loadData();
    } catch (error) {
      Alert.alert('Kļūda', 'Neizdevās izveidot lidojumu');
      console.error('Create flight error:', error);
    }
  };

  const handleUpdate = async (flightData: Omit<Flights, 'id'>) => {
    if (!selectedFlightId) return;
    try {
      await updateFlight(selectedFlightId, flightData);
      Alert.alert('Veiksmīgi', 'Lidojums atjaunināts');
      setSelectedOperation(null);
      setSelectedFlightId(null);
      await loadData();
    } catch (error) {
      Alert.alert('Kļūda', 'Neizdevās atjaunināt lidojumu');
      console.error('Update flight error:', error);
    }
  };

const handleDelete = async () => {
  if (!selectedFlightId) return;
  
  if (window.confirm(`Vai tiešām vēlaties dzēst lidojumu ar ID: ${selectedFlightId}?`)) {
    try {
      setLoading(true);
      console.log('Deleting flight ID:', selectedFlightId);
      
      await deleteFlight(selectedFlightId);
      
      alert('Lidojums veiksmīgi dzēsts!');
      console.log(' Lidojums veiksmīgi dzēsts!');
      
      setSelectedOperation(null);
      setSelectedFlightId(null);
      await loadData();
      
    } catch (error) {
      console.error('Delete error:', error);
      alert(`Kļūda: ${error instanceof Error ? error.message : 'Neizdevās dzēst lidojumu'}`);
    } finally {
      setLoading(false);
    }
  } else {
    console.log('Delete cancelled by user');
  }
};

  const getSelectedFlight = () => {
    return flights.find(flight => flight.id === selectedFlightId);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Ielādē datus...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
    }>
      <Text style={styles.title}>✈️ Lidojumu Pārvalde</Text>

      {/* Operāciju izvēle */}
      <View style={styles.operationSection}>
        <Text style={styles.sectionTitle}>Izvēlieties darbību:</Text>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.operationButton, selectedOperation === 'create' && styles.activeButton]}
            onPress={() => setSelectedOperation('create')}
          >
            <Text style={[styles.buttonText, selectedOperation === 'create' && styles.activeButtonText]}>
              ➕ Pievienot
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.operationButton, selectedOperation === 'update' && styles.activeButton]}
            onPress={() => setSelectedOperation('update')}
          >
            <Text style={[styles.buttonText, selectedOperation === 'update' && styles.activeButtonText]}>
              ✏️ Rediģēt
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.operationButton, selectedOperation === 'delete' && styles.activeButton]}
            onPress={() => setSelectedOperation('delete')}
          >
            <Text style={[styles.buttonText, selectedOperation === 'delete' && styles.activeButtonText]}>
              🗑️ Dzēst
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* DELETE operācija */}
      {selectedOperation === 'delete' && (
        <View style={styles.operationContainer}>
          <Text style={styles.operationTitle}>🗑️ Dzēst lidojumu</Text>
          
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownLabel}>Izvēlieties lidojumu:</Text>
            <ScrollView style={styles.dropdown} nestedScrollEnabled={true}>
              {flights.map(flight => (
                <TouchableOpacity
                  key={flight.id}
                  style={[
                    styles.dropdownItem,
                    selectedFlightId === flight.id && styles.selectedItem
                  ]}
                  onPress={() => setSelectedFlightId(flight.id)}
                >
                  <Text style={styles.flightInfo}>
                    <Text style={styles.flightNumber}>{flight.flight_number}</Text>
                    {' | '}{flight.status}{' | ID: '}{flight.id}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {selectedFlightId && (
            <TouchableOpacity style={styles.deleteConfirmButton} onPress={handleDelete}>
              <Text style={styles.deleteButtonText}>Dzēst lidojumu</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* UPDATE operācija */}
      {selectedOperation === 'update' && (
        <View style={styles.operationContainer}>
          <Text style={styles.operationTitle}>✏️ Rediģēt lidojumu</Text>
          
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownLabel}>Izvēlieties lidojumu:</Text>
            <ScrollView style={styles.dropdown} nestedScrollEnabled={true}>
              {flights.map(flight => (
                <TouchableOpacity
                  key={flight.id}
                  style={[
                    styles.dropdownItem,
                    selectedFlightId === flight.id && styles.selectedItem
                  ]}
                  onPress={() => setSelectedFlightId(flight.id)}
                >
                  <Text style={styles.flightInfo}>
                    <Text style={styles.flightNumber}>{flight.flight_number}</Text>
                    {' | '}{flight.status}{' | ID: '}{flight.id}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {selectedFlightId && (
            <FlightForm
              flight={getSelectedFlight()}
              airlines={airlines}
              routes={routes}
              aircrafts={aircrafts}
              airports={airports}
              onSubmit={handleUpdate}
              onCancel={() => {
                setSelectedOperation(null);
                setSelectedFlightId(null);
              }}
            />
          )}
        </View>
      )}

      {/* CREATE operācija */}
      {selectedOperation === 'create' && (
        <View style={styles.operationContainer}>
          <Text style={styles.operationTitle}>➕ Pievienot jaunu lidojumu</Text>
          <FlightForm
            airlines={airlines}
            routes={routes}
            aircrafts={aircrafts}
            airports={airports}
            onSubmit={handleCreate}
            onCancel={() => setSelectedOperation(null)}
          />
        </View>
      )}

      {/* Lidojumu saraksts */}
      <View style={styles.flightList}>
        <Text style={styles.sectionTitle}>📋 Pieejamie lidojumi ({flights.length})</Text>
        {flights.slice(0, 10).map(flight => {
          const route = routes.find(r => r.id === flight.route);
          const airline = airlines.find(a => a.id === flight.airline);
          
          return (
            <View key={flight.id} style={styles.flightItem}>
              <Text style={styles.flightNumber}>
                {airline?.name || 'Unknown'} {flight.flight_number}
              </Text>
              {route && (
                <>
                  <Text>
                    🛫 {route.departure_airport_details?.city || 'Unknown'} → 
                    🛬 {route.arrival_airport_details?.city || 'Unknown'}
                  </Text>
                  <Text>
                    Izlido: {new Date(flight.departure_time).toLocaleString('lv-LV')}
                  </Text>
                  <Text>
                    Ielido: {new Date(flight.arrival_time).toLocaleString('lv-LV')}
                  </Text>
                </>
              )}
              <Text>Statuss: {flight.status}</Text>
            </View>
          );
        })}
        {flights.length > 10 && (
          <Text style={styles.moreText}>... un vēl {flights.length - 10} lidojumi</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  operationSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#2c3e50',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  operationButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeButton: {
    backgroundColor: '#007bff',
    borderColor: '#0056b3',
  },
  buttonText: {
    fontWeight: '600',
    color: '#6c757d',
  },
  activeButtonText: {
    color: 'white',
  },
  operationContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  operationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2c3e50',
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#495057',
  },
  dropdown: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedItem: {
    backgroundColor: '#007bff20',
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  flightInfo: {
    fontSize: 14,
  },
  flightNumber: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  deleteConfirmButton: {
    backgroundColor: '#dc3545',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  flightList: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flightItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  moreText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#6c757d',
    marginTop: 8,
  },
});