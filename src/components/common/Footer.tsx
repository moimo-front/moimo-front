function Footer() {
  return (
    <>
      <div className="flex py-8 bg-foreground text-sm text-card shrink-0">
        <div className="flex flex-col justify-around mx-1 gap-1">
          <div className="text-lg">MoiMo</div>
          <div className="text-xs text-card/80">
            당신의 관심사로 시작하는 새로운 만남
          </div>
          <div className="text-xs text-card/80">
            © 2025 MoiMo. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
