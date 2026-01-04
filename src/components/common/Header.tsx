import { Button } from "../ui/button";

function Header() {
  return (
    <div className="flex items-center w-full h-[67px] bg-card">
      <Button
        size="lg"
        variant="ghost"
        className="cursor-pointer hover:bg-transparent font-bold text-xl"
      >
        MoiMo
      </Button>
      <div className="flex gap-2 ml-8">
        <Button
          size="default"
          variant="ghost"
          className="cursor-pointer hover:bg-transparent"
        >
          모이머란?
        </Button>
        <Button
          size="default"
          variant="ghost"
          className="cursor-pointer hover:bg-transparent"
        >
          원하는 모임 찾기
        </Button>
      </div>
      <div className="login ml-auto">
        <Button
          size="default"
          variant="ghost"
          className="cursor-pointer hover:bg-transparent text-sm"
        >
          로그인
        </Button>
      </div>
      {/* {isLogin ? <Profile /> : <Login />} */}
    </div>
  );
}

export default Header;
