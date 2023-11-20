import { CalendarCard } from "@nutui/nutui-react-taro";

function DatePage() {
  const now = new Date();

  return (
    <div className="flex flex-col items-center h-screen">
      <div className="w-5/6 rounded-xl std-box-shadow">
        <CalendarCard defaultValue={now} />
      </div>
    </div>
  );
}

export default DatePage;
