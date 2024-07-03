import Link from "next/link";
import { FiHome } from "react-icons/fi";

function Breadcrumb({ routes }) {
  return (
    <div className="flex items-center">
      <FiHome color="#2D3250" opacity="20%" className="-mr-1" />
      <ul className="flex divide-dpaccent/15 divide-x text-xs text-dpaccent/25">
        {routes.map((route, i) => (
          <RouteList route={route} key={i} />
        ))}
      </ul>
    </div>
  );
}

export function RouteList({ route }) {
  return (
    <Link
      href={route.path}
      className="px-4 hover:text-dpaccent/35 duration-300 transition-colors"
    >
      {route.title}
    </Link>
  );
}

export default Breadcrumb;
