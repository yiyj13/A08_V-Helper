import { Image, View, Text, ScrollView } from "@tarojs/components";
import { Cell, SearchBar, Button } from "@nutui/nutui-react-taro";
import { Uploader } from "@nutui/icons-react-taro";
import "./index.css";
import VacPNG from "../../assets/home/vac.png";
import DoctorPNG from "../../assets/home/doctor.png";
import TemperaturePNG from "../../assets/home/temp.png";
import { useTabStore } from "../../models";
import { useState } from "react";

export default function HomePage() {
  const setTabIndex = useTabStore((state) => state.setTabIndex);
  return (
    <>
      <SearchBar placeholder="搜索" shape="round" />

      <div className="grid_">
        <BigButton text="疫苗查询" src={VacPNG} />
        <BigButton text="接种记录" src={VacPNG} />
        <BigButton
          text="预约提醒"
          src={DoctorPNG}
          onClick={() => setTabIndex(3)}
        />
        <BigButton text="体温记录" src={TemperaturePNG} />
      </div>

      <NoticeView />
    </>
  );
}

interface IBigButton {
  text: string;
  src: string;
  onClick?: () => any;
}
function BigButton({ text, src, onClick }: IBigButton) {
  return (
    <Button className="grid-btn " type="primary" onClick={onClick}>
      <Image src={src} className="grid-btn-image" />
      <Text className="grid-btn-title">{text}</Text>
    </Button>
  );
}

type TNotice = {
  title: string;
  content: string | null;
  time: string | null;
};
function NoticeView() {
  const [debugList, setDebugList] = useState<TNotice[]>([
    {
      title: "COVID vaccine",
      content: "You have an appointment at 10:00 am today",
      time: "2021-12-12 10:00:00",
    },
  ]);

  return (
    <View className="noticeview">
      <Text className="noticeview-title">今日提醒</Text>
      <ScrollView scrollY scrollTop={0} lowerThreshold={20} upperThreshold={20}>
        {debugList.map((item, index) => {
          return (
            <>
              <Cell
                key={item.time || index}
                className="gap-x-4 py-5 noticeview-item"
                radius="20px"
              >
                <View className="flex flex-col min-w-0">
                  <Text className="text-sm font-semibold leading-6 text-gray-900">
                    {item.title}
                  </Text>
                  <Text className="mt-1 truncate text-xs leading-5 text-gray-500">
                    {item.content}
                  </Text>
                </View>
              </Cell>
            </>
          );
        })}

        <Cell
          className="noticeview-item"
          radius="20px"
          onClick={() => {
            setDebugList([
              ...debugList,
              {
                title: "Another thing",
                content: "None",
                time: "2021-12-12 14:00:00",
              },
            ]);
          }}
        >
          <Uploader />
        </Cell>
        <View style="height:150px" />
      </ScrollView>
    </View>
  );
}
