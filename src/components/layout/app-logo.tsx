import CarRentalIcon from '@mui/icons-material/CarRental';

export default function AppLogo() {
  return (
    <div
      className="flex flex-row items-center text-white"
    >
      <CarRentalIcon className="h-12 w-12 rotate-[15deg]" />
      <p className="text-[12px]">KLH VOITURES</p>
    </div>
  );
}
