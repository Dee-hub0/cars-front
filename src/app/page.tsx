import ListCars from '@/components/cars/list-cars';

export default async function Page() {
  return (
    <main className="flex justify-center items-center min-h-screen">
      <div className="w-[70%]">
        <ListCars />
      </div>
    </main>
  );
}