function Frame() {
  return (
    <div className="absolute backdrop-blur-[33.642px] bg-[rgba(255,255,255,0.2)] bottom-0 h-[508.372px] left-[5.94px] rounded-[60.32px] w-[1362.765px]">
      <div aria-hidden="true" className="absolute border-[#8181ff] border-[2.808px] border-solid inset-0 pointer-events-none rounded-[60.32px] shadow-[0px_77.999px_165.359px_16.64px_rgba(97,97,255,0.5)]" />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute bottom-0 contents left-[5.94px]">
      <Frame />
    </div>
  );
}

export default function Ai() {
  return (
    <div className="relative size-full" data-name="AI">
      <div className="absolute blur-[47.809px] h-[507.632px] left-0 rounded-[61.005px] top-0 w-[1376px]" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\\\'http://www.w3.org/2000/svg\\\' viewBox=\\\'0 0 1376 507.63\\\' preserveAspectRatio=\\\'none\\\'><g transform=\\\'matrix(4.2128e-15 25.382 -68.8 1.5542e-15 688 253.82)\\\'><foreignObject x=\\\'-190\\\' y=\\\'-190\\\' width=\\\'380\\\' height=\\\'380\\\'><div xmlns=\\\'http://www.w3.org/1999/xhtml\\\' style=\\\'background-image: conic-gradient(from 90deg, rgba(129, 129, 255, 1) 0%, rgba(129, 129, 255, 1) 15.66%, rgba(90, 174, 237, 1) 28.66%, rgba(51, 219, 219, 1) 41.66%, rgba(51, 216, 181, 1) 47.41%, rgba(51, 213, 142, 1) 53.16%, rgba(77, 213, 131, 1) 54.535%, rgba(102, 213, 119, 1) 55.91%, rgba(153, 214, 97, 1) 58.66%, rgba(204, 214, 74, 1) 61.41%, rgba(255, 214, 51, 1) 64.16%, rgba(254, 181, 70, 1) 69.535%, rgba(254, 148, 88, 1) 74.91%, rgba(253, 115, 107, 1) 80.285%, rgba(252, 82, 125, 1) 85.66%, rgba(221, 94, 158, 1) 89.245%, rgba(191, 106, 190, 1) 92.83%, rgba(160, 117, 223, 1) 96.415%, rgba(129, 129, 255, 1) 100%); opacity:1; height: 100%; width: 100%;\\\'></div></foreignObject></g></svg>')" }} />
      <Group />
    </div>
  );
}