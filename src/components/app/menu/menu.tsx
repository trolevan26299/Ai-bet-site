import { paths } from "@/routes/paths";
import { Icon } from "@iconify/react";
import { usePathname, useRouter } from "next/navigation";

const Menu = () => {
  const router = useRouter();
  const pathName = usePathname();

  const menuNavigation = [
    { id: "1", name: "Trận đấu", url: paths.odds, icon: "mdi:soccer-field" },
    { id: "2", name: "Yêu thích", url: paths.favorites, icon: "gravity-ui:star" },
    { id: "3", name: "Cược của tôi", url: paths.history, icon: "f7:tickets-fill" },
    { id: "4", name: "Kết quả ", url: paths.result, icon: "carbon:result" },
    { id: "5", name: "Cài đặt", url: paths.settings, icon: "uil:setting" },
  ];

  const handleNavigation = (url: string) => {
    if (pathName === url) {
      window.location.href = url;
    } else {
      router.push(url);
    }
  };

  return (
    <div
      className={`z-10 bottom-0 fixed m-auto rounded-sm flex items-center flex-row justify-around flex-wrap w-full px-4 pt-2 pb-3 rounded-tr-[20px] rounded-tl-[20px]`}
      style={{ backgroundColor: "rgba(13, 22, 31, 1)" }}
    >
      {menuNavigation.map((item) => {
        const isActive = pathName === item.url;
        return (
          <div
            className="group flex flex-col justify-center items-center gap-[4.5px] hover:cursor-pointer text-[rgba(159,162,167,1)]"
            key={item.id}
            onClick={() => handleNavigation(item.url)}
          >
            <Icon
              icon={item.icon}
              className={`w-[21.43px] h-[21.43px] group-hover:text-[rgba(121,228,169,1)] ${
                isActive ? "text-[rgba(121,228,169,1)]" : "group-hover:text-[rgba(121,228,169,1)]"
              }`}
            />
            <p
              className={`text-[12.86px] font-bold leading-[15.56px] group-hover:text-[rgba(255,255,255,1)] ${
                isActive ? "text-[rgba(255,255,255,1)]" : "group-hover:text-[rgba(255,255,255,1)]"
              }`}
            >
              {item.name}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Menu;
