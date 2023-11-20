import { Button } from "@nutui/nutui-react-taro";
import { useUserInfo } from "taro-hooks";

function ProfilePage() {
  const [userInfo, { getUserProfile }] = useUserInfo();

  return (
    <div className="flex flex-col items-center h-screen">
      <div className="flex m-4">
        <div className="mr-4 flex-shrink-0">
          <img
            className="inline-block h-16 w-16 rounded-full"
            src={userInfo?.userInfo?.avatarUrl}
            alt=""
          />
        </div>
        <div>
          <h4 className="text-lg font-bold">Lorem ipsum</h4>
          <p className="mt-1">
            Repudiandae sint consequuntur vel. Amet ut nobis explicabo numquam
            expedita quia omnis voluptatem. Minus quidem ipsam quia iusto.
          </p>
        </div>
      </div>
      <Button
        type="primary"
        className="mt-4"
        onClick={() => getUserProfile({ lang: "zh_CN", desc: "test" })}
      >
        get user profile
      </Button>
    </div>
  );
}

export default ProfilePage;
