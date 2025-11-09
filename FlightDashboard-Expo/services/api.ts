const API_BASE_URL = 'http://127.0.0.1:8000';

export interface Flights {
  id: number;
  flight_number: string;
  departure_time: string;
  arrival_time: string;
  status: string;
  airline: number;
  route: number;
  aircraft: number | null;
}

export interface Airlines {
  id: number;
  name: string;
}

export interface Airports {
  id: number;
  city: string;
  country: string;
}

export interface Routes {
  id: number;
  departure_airport: number;
  arrival_airport: number;
  departure_airport_details: Airports;
  arrival_airport_details: Airports;
}

export interface Aircrafts {
  id: number;
  model: string;
}

export const fetchFlights = async (): Promise<Flights[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/flights/`);
    if (!response.ok) throw new Error('Failed to fetch flights');
    return await response.json();
  } catch (error) {
    console.error('Error fetching flights:', error);
    return [];
  }
};

export const createFlight = async (flightData: Omit<Flights, 'id'>): Promise<Flights> => {
  const response = await fetch(`${API_BASE_URL}/flights/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(flightData),
  });
  if (!response.ok) throw new Error('Failed to create flight');
  return response.json();
};

export const updateFlight = async (id: number, flightData: Omit<Flights, 'id'>): Promise<Flights> => {
  const response = await fetch(`${API_BASE_URL}/flights/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(flightData),
  });
  if (!response.ok) throw new Error('Failed to update flight');
  return response.json();
};

export const deleteFlight = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/flights/${id}/`, {
    method: 'DELETE',
  });
  
  if (!response.ok && response.status !== 204) {
    const errorText = await response.text();
    console.error('Delete flight error:', response.status, errorText);
    throw new Error(`Failed to delete flight: ${response.status} ${errorText}`);
  }
  
  return;
};

export const fetchAirlines = async (): Promise<Airlines[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/airlines/`);
    if (!response.ok) throw new Error('Failed to fetch airlines');
    return await response.json();
  } catch (error) {
    console.error('Error fetching airlines:', error);
    return [];
  }
};

export const fetchRoutes = async (): Promise<Routes[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/routes/`);
    if (!response.ok) throw new Error('Failed to fetch routes');
    const routes = await response.json();
    
    const routesWithAirportDetails = await Promise.all(
      routes.map(async (route: Routes) => {
        try {
          const [departureResponse, arrivalResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/airports/${route.departure_airport}/`),
            fetch(`${API_BASE_URL}/airports/${route.arrival_airport}/`)
          ]);
          
          if (departureResponse.ok && arrivalResponse.ok) {
            const departure_airport_details = await departureResponse.json();
            const arrival_airport_details = await arrivalResponse.json();
            
            return {
              ...route,
              departure_airport_details,
              arrival_airport_details
            };
          }
          return route;
        } catch (error) {
          console.error('Error fetching airport details:', error);
          return route;
        }
      })
    );
    
    return routesWithAirportDetails;
  } catch (error) {
    console.error('Error fetching routes:', error);
    return [];
  }
};

export const fetchAircrafts = async (): Promise<Aircrafts[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/aircrafts/`);
    if (!response.ok) throw new Error('Failed to fetch aircrafts');
    return await response.json();
  } catch (error) {
    console.error('Error fetching aircrafts:', error);
    return [];
  }
};

export const fetchAirports = async (): Promise<Airports[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/airports/`);
    if (!response.ok) throw new Error('Failed to fetch airports');
    return await response.json();
  } catch (error) {
    console.error('Error fetching airports:', error);
    return [];
  }
};