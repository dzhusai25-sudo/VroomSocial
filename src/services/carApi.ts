// Получение списка марок (сортировка по имени)
export async function getCarBrands() {
  const res = await fetch(
    "https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json",
  );
  const data = await res.json();
  return data.Results.map((make: any) => make.MakeName).sort();
}

// Получение моделей по марке
export async function getModelsByBrand(brand: string) {
  const res = await fetch(
    `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${brand}?format=json`,
  );
  const data = await res.json();
  return data.Results.map((model: any) => model.Model_Name).sort();
}
