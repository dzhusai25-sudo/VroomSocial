export async function getCarBrands() {
  try {
    const response = await fetch(
      "https://www.carqueryapi.com/api/0.3/?cmd=getMakes",
    );
    const data = await response.json();
    if (!data.Makes || !Array.isArray(data.Makes)) {
      throw new Error("Неверный формат ответа");
    }
    return data.Makes.map((make: any) => make.make_display).sort();
  } catch (error) {
    console.error("Ошибка загрузки марок:", error);
    return [];
  }
}

export async function getModelsByBrand(brand: string) {
  try {
    const response = await fetch(
      `https://www.carqueryapi.com/api/0.3/?cmd=getModels&make=${encodeURIComponent(brand)}`,
    );
    const data = await response.json();
    if (!data.Models || !Array.isArray(data.Models)) {
      throw new Error("Неверный формат ответа");
    }
    return data.Models.map((model: any) => model.model_name).sort();
  } catch (error) {
    console.error("Ошибка загрузки моделей:", error);
    return [];
  }
}

// // Получение списка марок (сортировка по имени)
// export async function getCarBrands() {
//   const res = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json');
//   const data = await res.json();
//   return data.Results.map((make: any) => make.MakeName).sort();
// }

// // Получение моделей по марке
// export async function getModelsByBrand(brand: string) {
//   const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${brand}?format=json`);
//   const data = await res.json();
//   return data.Results.map((model: any) => model.Model_Name).sort();
