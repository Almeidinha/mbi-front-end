import Icon from "@ant-design/icons/lib/components/Icon";
import { GetProps } from "antd";

type CustomIconComponentProps = GetProps<typeof Icon>;

const KeySvg = () => (
  <svg focusable="false" aria-hidden="true" viewBox="0 0 32 32" width="1em" height="1em" fill="currentColor">
    <path d="M22 0c-5.523 0-10 4.477-10 10 0 0.626 0.058 1.238 0.168 1.832l-12.168 12.168v6c0 1.105 0.895 2 2 2h2v-2h4v-4h4v-4h4l2.595-2.595c1.063 0.385 2.209 0.595 3.405 0.595 5.523 0 10-4.477 10-10s-4.477-10-10-10zM24.996 10.004c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"></path>
  </svg>
);

const KeyFillSvg = () => (
  <svg focusable="false" aria-hidden="true" viewBox="0 0 32 32" width="1em" height="1em" fill="currentColor">
    <path d="M22 0c-5.523 0-10 4.477-10 10 0 0.625 0.074 1.227 0.184 1.816l-12.184 12.184v8h12v-4h4v-4h4v-4l0.184-0.184c0.589 0.11 1.191 0.184 1.816 0.184 5.523 0 10-4.477 10-10s-4.477-10-10-10zM22.008 12c-1.105 0-2-0.895-2-2s0.895-2 2-2 2 0.895 2 2-0.895 2-2 2z"></path>
  </svg>
);

const FilterDataSvg = () => (
  <svg focusable="false" aria-hidden="true" viewBox="0 0 512 512" width="1em" height="1em">
    <path pointerEvents="none" fill="none" d="M0 0h512v512H0z"/>
    <path d="M85 448h21v20H85v-20zM291 489h21v21h-21v-21zM177 489h21v20h-21v-20zM322 429h21v20h-21v-20zM312 2H208c-6 0-10 5-10 10v142c0 5 4 10 10 10h104c6 0 10-5 10-10V12c0-5-4-10-10-10zm-31 101h-42V83h42v20zm0-40h-42V42h42v21zM167 2H63c-6 0-11 5-11 10v142c0 5 5 10 11 10h104c5 0 10-5 10-10V12c0-5-5-10-10-10zm-31 101H94V83h42v20zm0-40H94V42h42v21zM457 2H354c-6 0-11 5-11 10v142c0 5 5 10 11 10h103c6 0 11-5 11-10V12c0-5-5-10-11-10zm-31 101h-41V83h41v20zm0-40h-41V42h41v21zM465 197c-2-2-5-3-8-3H63c-6 0-11 5-11 10 0 3 1 5 3 7l164 170v107c0 4 2 7 6 9a10 10 0 0 0 11-1l62-51c2-2 4-5 4-8v-56l163-170c4-4 4-10 0-14zM266 314c-3 2-8 2-12 0l-42-31 13-16 25 18v-50h21v50l24-18 13 16-42 31zM385 372h21v20h-21v-20zM385 469h21v21h-21v-21z" fill="currentColor"/>
    <path d="M136 379h21v22h-21v-22z" fill="currentColor"/>
  </svg>
);

const AddFilterSvg = () => (
  <svg focusable="false" aria-hidden="true" viewBox="0 0 512 512" width="1em" height="1em">
    <path fillOpacity="0" pointerEvents="none" d="M0 0h512v512H0z"/>
    <path d="M-1-1h512v512H-1z" fillOpacity="0" pointerEvents="none"/>
    <path fillOpacity="0" pointerEvents="none" d="M-1-1h512v512H-1z"/>
    <path d="M254 5C115 5 3 40 3 83v47l188 188v157c0 17 28 31 63 31 34 0 62-14 62-31V318l188-188V83c0-43-112-78-250-78zM49 73c12-7 28-13 48-19 43-12 99-18 157-18s113 6 157 18c19 6 35 12 47 19 8 4 12 8 14 10-2 2-6 6-14 10-12 7-28 13-47 19-44 11-99 18-157 18s-114-7-157-18c-20-6-36-12-48-19-8-4-12-8-14-10 2-2 6-6 14-10z" fill="currentColor"/>
    <g transform="matrix(.70789 0 0 -.70789 -37 561)" clipPath="url(#clipPath855)">
      <g clipPath="url(#clipPath2094)" fill="currentColor" transform="translate(-2 2)">
        <g clipPath="url(#clipPath3084)" transform="translate(4 -9)">
          <g clipPath="url(#clipPath4118)" transform="translate(-10 -16)">
            <path d="M679 382h-88v-77h-73v-84h73v-77h88v77h77v84h-77z" fill="currentColor"/>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

const SetSquareSvg = () => (
  <svg focusable="false" aria-hidden="true" viewBox="0 0 512 512" width="1em" height="1em">
    <path pointerEvents="none" fill="none" d="M0 0h512v512H0z"/>
    <path d="M501 481L37 5c-8-7-19-7-26 0-3 3-5 8-5 13v150h28c10 0 18 8 18 18s-8 18-18 18H6v36h28c10 0 18 8 18 18s-8 18-18 18H6v43h28c10 0 18 7 18 18s-8 18-18 18H6v35h28c10 0 18 8 18 18s-8 18-18 18H6v68c0 10 8 18 18 18h464c10 0 18-8 18-18 0-5-2-9-5-13zm-371-88V277l111 116H130z" fill="currentColor"/>
  </svg>
);

const CubeStackSvg = () => (
  <svg focusable="false" aria-hidden="true" viewBox="0 0 512 512" width="1em" height="1em">
    <path pointerEvents="none" fill="none" d="M0 0h512v512H0z"/>
    <path d="M2 291l1 151c0 2 1 4 3 4l120 64h3l1 1a5 5 0 0 0 5 0l119-64 2-3 3 2 120 64h3l1 1a5 5 0 0 0 5 0l119-64c2-1 3-3 3-5V285v-1l-1-1v-1a6 6 0 0 0-1-1h-1v-1l-123-59h-2V65v-1-1-1l-1-1a6 6 0 0 0-1-1h-1L257 0l-5 1-121 63c-2 1-3 2-3 4v153h-1L5 284c-1 1-3 3-3 5v2zM365 65l-107 60-113-56 110-58 110 54zm7 155l-108 57V134l108-60v146zm19 135l108-61v145l-108 59V355zm-119-66l110-57 110 54-106 59-114-56zm-134 66l108-61v145l-108 59V355zM19 289l110-57 110 54-106 59-114-56z" fill="currentColor"/>
  </svg>
);

const DatabaseSvg = () => (
  <svg focusable="false" aria-hidden="true" viewBox="0 0 512 512" width="1em" height="1em">
    <rect width="512" height="512" fillOpacity="0" pointerEvents="none"/>
    <path transform="matrix(2.426 0 0 2.426 -2692.7 -412.32)" d="m1299.3 312.6c-0.4 0.4-0.8 0.9-1.2 1.3-0.6 0.6-1.4 1.3-2.1 1.9-0.5 0.4-0.9 0.8-1.3 1.2-0.9 0.7-1.8 1.3-2.8 2-0.4 0.3-0.8 0.6-1.3 0.9-1.5 1-3 1.9-4.7 2.8-17 9.2-42.5 14.4-69.8 14.4s-52.7-5.3-69.8-14.4c-1.7-0.9-3.2-1.8-4.7-2.8-0.5-0.3-0.9-0.7-1.4-1-0.9-0.6-1.9-1.3-2.7-1.9-0.5-0.4-0.9-0.8-1.4-1.2l-2.1-1.8c-0.4-0.4-0.8-0.9-1.2-1.3-0.6-0.6-1.1-1.2-1.6-1.8l-0.3-0.3v33.2c0 18.9 39 34.8 85.1 34.8s85.1-15.9 85.1-34.8v-33.2l-0.3 0.3c-0.4 0.5-1 1.1-1.5 1.7zm-83.3-141.2c-46.1 0-85.1 15.9-85.1 34.8 0 7.4 6.2 14.8 17.5 20.9 16.4 8.8 41 13.9 67.6 13.9s51.2-5.1 67.6-13.9c11.3-6.1 17.5-13.5 17.5-20.9 0-18.8-38.9-34.8-85.1-34.8zm0 62.5c-34.2 0-63.2-11.1-63.2-24.2 0-12.9 18.9-18.9 19.8-19.2 1.2-0.4 2.5 0.3 2.8 1.5 0.4 1.2-0.3 2.5-1.5 2.8-0.2 0.1-16.6 5.3-16.6 14.9 0 9.1 25.6 19.7 58.6 19.7 1.3 0 2.3 1 2.3 2.3 0.1 1.1-0.9 2.2-2.2 2.2zm83.3-12.9c-0.4 0.4-0.8 0.9-1.2 1.3-0.6 0.6-1.4 1.3-2.1 1.9-0.5 0.4-0.9 0.8-1.3 1.2-0.9 0.7-1.8 1.3-2.8 2-0.4 0.3-0.8 0.6-1.3 0.9-1.5 1-3 1.9-4.7 2.8-17 9.2-42.5 14.4-69.8 14.4s-52.7-5.3-69.8-14.4c-1.7-0.9-3.2-1.8-4.7-2.8-0.5-0.3-0.9-0.7-1.4-1-0.9-0.6-1.9-1.3-2.7-1.9-0.5-0.4-0.9-0.8-1.4-1.2l-2.1-1.8c-0.4-0.4-0.8-0.9-1.2-1.3-0.6-0.6-1.1-1.2-1.6-1.8l-0.3-0.3v33c0 7.4 6.2 14.8 17.5 20.9 16.4 8.8 41 13.9 67.6 13.9s51.2-5.1 67.6-13.9c11.3-6.1 17.5-13.5 17.5-20.9v-33.2l-0.3 0.3c-0.4 0.7-1 1.3-1.5 1.9zm-0.1 45.9c-0.4 0.4-0.8 0.9-1.2 1.3-0.7 0.6-1.4 1.3-2.1 1.9-0.4 0.4-0.8 0.8-1.3 1.1-0.9 0.7-1.8 1.4-2.8 2-0.4 0.3-0.8 0.6-1.3 0.9-1.5 1-3 1.9-4.7 2.8-17 9.2-42.5 14.4-69.8 14.4s-52.7-5.3-69.8-14.4c-1.7-0.9-3.2-1.8-4.7-2.8-0.5-0.3-0.9-0.7-1.4-1-0.9-0.6-1.9-1.3-2.7-1.9-0.5-0.4-0.9-0.8-1.4-1.2l-2.1-1.8c-0.4-0.4-0.8-0.9-1.2-1.3-0.6-0.6-1.1-1.2-1.6-1.8l-0.3-0.3v33.2c0 7.4 6.2 14.8 17.5 20.9 16.4 8.8 41 13.9 67.6 13.9s51.2-5.1 67.6-13.9c11.3-6.1 17.5-13.5 17.5-20.9v-33.2l-0.3 0.3c-0.3 0.5-0.9 1.1-1.5 1.8z" fill="currentColor"/>
  </svg>
);

const FunctionSvg = () => (
  <svg focusable="false" aria-hidden="true" viewBox="0 0 512 512" width="1em" height="1em">
    <path fill="currentColor" d="M384 85v64h-149l106 107-106 107h149v64h-256v-43l139-128-139-128v-43h256z"></path>
  </svg>
);

const CalculatorSvg = () => (
  <svg focusable="false" aria-hidden="true" viewBox="0 0 512 512" width="1em" height="1em">
    <path fill="currentColor" d="M192 32h-160c-17.6 0-32 14.4-32 32v160c0 17.6 14.398 32 32 32h160c17.6 0 32-14.4 32-32v-160c0-17.6-14.4-32-32-32zM192 160h-160v-32h160v32zM448 32h-160c-17.602 0-32 14.4-32 32v416c0 17.6 14.398 32 32 32h160c17.6 0 32-14.4 32-32v-416c0-17.6-14.4-32-32-32zM448 320h-160v-32h160v32zM448 224h-160v-32h160v32zM192 288h-160c-17.6 0-32 14.4-32 32v160c0 17.6 14.398 32 32 32h160c17.6 0 32-14.4 32-32v-160c0-17.6-14.4-32-32-32zM192 416h-64v64h-32v-64h-64v-32h64v-64h32v64h64v32z"></path>
  </svg>
);

const AddSequenceSvg = () => (
  <svg focusable="false" aria-hidden="true" viewBox="0 0 512 512" width="1em" height="1em">
    <path fillOpacity="0" pointerEvents="none" d="M0 0h512v512H0z"/>
    <path d="M0 0h512v512H0z" fillOpacity="0" pointerEvents="none"/>
    <path fillOpacity="0" pointerEvents="none" d="M0 0h512v512H0z"/>
    <path d="M213 429v-50h61l-11-15h-50v-51h111v28l13 6V185l1-5v-11h7c3-3 8-5 13-5h60c5 0 10 2 13 5h21v58h-13v16h13v54h-13v16h13v28l15-6V28c0-10-8-18-18-18H23c-9 0-17 8-17 18v398c0 7 3 12 7 15v3h6l4 1h299l-12-16h-97zM338 26h111c2 0 3 1 3 2v53H338V26zm0 70h114v57H338V96zM213 26h111v55H213V26zm0 70h111v57H213V96zm0 73h111v58H213v-58zm0 74h111v54H213v-54zM74 429H22l-1-3v-47h53v50zm0-65H21v-51h53v51zm0-67H21v-54h53v54zm0-70H21v-58h53v58zm0-74H21V96h53v57zm124 276H89v-50h109v50zm0-65H89v-51h109v51zm0-67H89v-54h109v54zm0-70H89v-58h109v58zm0-74H89V96h109v57zm0-72H89V26h109v55zm306 262L390 499c-1 2-3 3-5 3s-3-1-5-3L267 343a7 7 0 0 1 0-8c1-2 4-3 7-2l75 32V181c0-4 3-6 6-6h60c4 0 6 2 6 6v184l76-32c2-1 5 0 7 2v8z" fill="currentColor"/>
</svg>
);

const OpenFolderSvg = () => (
  <svg focusable="false" aria-hidden="true" viewBox="0 0 512 512" width="1em" height="1em">
    <path fillOpacity="0" pointerEvents="none" d="M0 0h512v512H0z"/>
    <path d="M396.091 421.887c1.083-.382 1.985-.955 2.887-1.337 9.742-6.876 19.664-13.561 29.586-20.056V142.442c0-21.393-15.695-36.864-35.9-36.864H275.222V92.589c0-25.595-16.958-44.314-38.967-44.314H65.413c-21.829 0-41.132 18.72-41.132 44.314v322.04c0 3.63.902 6.876 1.624 10.315l.36.19c.722 3.63 1.805 6.877 3.248 10.124h349.08c4.33-3.247 8.659-6.685 13.169-9.741 1.082-1.529 2.525-2.866 4.33-3.63z" fill="currentColor"/>
    <path transform="matrix(1.804 0 0 1.91 -268.332 -328.966)" d="M366.5 230.5c9.2 0 15.9 7.2 15.9 16.3v120.4c2.7-2.9 5.3-5.8 8-8.8V246.8c0-6.4-2.4-12.2-7-16.7-4.5-4.5-10.5-6.6-16.9-6.6h-61.1v-2.8c0-7.4-2.5-14.1-7.3-19.3-4.9-5.4-11.3-7.9-18.3-7.9h-94.7c-14.2 0-26.8 11.8-26.8 27.2v168.6c0 1.7.4 3.3.7 4.8h8.3v-.6l.1-.1c-.2-1.3-.1-2.6-.1-4.1V220.7c0-11.2 7.7-20.2 17.8-20.2h94.7c10 0 17.6 9 17.6 20.2v9.8h69.1z" fill="#fff" stroke="currentColor" strokeWidth="5"/>
    <path d="M400.962 416.73c0 11.652-7.937 22.157-18.22 22.157H76.057c-10.464 0-19.664-10.505-19.664-22.157V148.173c0-11.652 9.2-20.63 19.664-20.63h306.685c10.463 0 18.22 8.978 18.22 20.63V416.73z" fill="#fff"/>
    <path d="M375.242 453.67c2.278 0 4.303-.269 6.329-.537-2.026 0-4.304.536-6.33.536z" fill="#3a2f28"/>
    <path d="M140.28 147.218h228.21v9.55H140.28v-9.55zM91.03 169.375h277.46v9.55H91.03v-9.55z" fill="currentColor"/>
    <g>
      <path d="M420.846 420.587c-3.747 10.391-14.81 20.782-24.803 20.782H37.378c-9.814 0-14.81-10.39-10.885-20.782l72.269-197.432c3.747-10.391 14.81-17.948 24.803-17.948h358.664c9.814 0 14.81 7.557 10.885 17.948l-72.268 197.432z" fill="currentColor"/>
      <path d="M369.8 405h-201c-3.6 0-6.9-1.7-8.9-4.5-2.2-3.3-2.6-7.7-1-11.9l40.5-104.5c2.7-6.9 10.2-12.1 17.6-12.1h201c4 0 7.3 1.5 9.2 4.3 2 2.9 2.2 6.6.7 10.6l-40.5 104.5c-2.6 6.6-10 13.6-17.6 13.6zM217 280c-4.1 0-8.6 3.1-10.1 6.9l-40.5 104.5c-.6 1.7-.6 3.4.1 4.5.5.7 1.2 1.1 2.3 1.1h201c3.5 0 8.5-4.1 10.1-8.4l40.5-104.5c.5-1.4.6-2.6.2-3.2-.4-.5-1.3-.9-2.6-.9H217z" fill="#fff" stroke="currentColor" strokeWidth="5" paintOrder="fill" transform="matrix(1.7844 0 0 1.8893 -263.65 -316.24)"/>
    </g>
  </svg>
);

const RefreshSvg = () => (
  <svg focusable="false" aria-hidden="true" viewBox="0 0 512 512" width="1em" height="1em">
    <path fillOpacity="0" pointerEvents="none" d="M0 0h512v512H0z"/>
    <path fillOpacity="0" pointerEvents="none" d="M0 0h512v512H0z"/>
    <path d="M457.252 225.308c-10.943-100.279-96.116-178.59-199.26-178.59-63.711 0-120.517 29.91-157.265 76.377l38.005 61.035c19.423-36.574 55.137-63.184 97.421-70.113 1.52-.248 3.042-.487 4.576-.687a125.38 125.38 0 0 1 6.318-.672c.901-.072 1.807-.135 2.71-.192 2.73-.168 5.466-.288 8.234-.288 66.992 0 122.722 49.056 133.214 113.129h-41.621l76.156 122.302 76.148-122.302H457.25z" fill="currentColor"/>
    <path d="M257.991 382.214c-66.998 0-122.725-49.058-133.217-113.136h41.619l-76.15-122.302-76.154 122.302h44.64c9.84 90.21 79.742 162.64 168.77 176.282a200.882 200.882 0 0 0 30.492 2.318c3.557 0 7.084-.128 10.597-.313.988-.055 1.965-.12 2.945-.183 2.794-.193 5.566-.431 8.32-.735.785-.087 1.567-.152 2.35-.248 3.409-.415 6.793-.912 10.148-1.493.77-.136 1.532-.296 2.3-.44 2.69-.495 5.36-1.047 8.012-1.653.935-.216 1.873-.432 2.8-.655 3.301-.807 6.573-1.662 9.807-2.629.008 0 .015-.008.025-.008 3.26-.974 6.47-2.062 9.658-3.195.85-.304 1.698-.615 2.549-.935a198.99 198.99 0 0 0 7.698-3.038c.62-.263 1.246-.51 1.864-.774a198.46 198.46 0 0 0 9.21-4.25c.522-.264 1.037-.537 1.56-.8a213.154 213.154 0 0 0 7.664-4.076c.636-.358 1.27-.711 1.902-1.07a202.009 202.009 0 0 0 17.393-11.21c.402-.297.803-.585 1.202-.878 1.064-.785 2.142-1.534 3.194-2.334h-.157c13.497-10.276 25.703-22.158 36.218-35.464l-38.005-61.035c-22.691 42.729-67.588 71.952-119.254 71.952z" fill="currentColor"/>
  </svg>
);

const InsertColumnSvg = () => (
  <svg focusable="false" aria-hidden="true" viewBox="0 0 512 512" width="1em" height="1em">
    <path fillOpacity="0" pointerEvents="none" d="M0 0h512v512H0z"/>
    <path d="M0 0h512v512H0z" fillOpacity="0" pointerEvents="none"/>
    <path fillOpacity="0" pointerEvents="none" d="M0 0h512v512H0z"/>
    <path d="M501 27c0-12-10-22-22-22H287c-12 0-22 10-22 22v81H36c-11 0-21 9-21 21v359c0 11 10 21 21 21h359c12 0 21-10 21-21v-98h63c12 0 22-9 22-21V27zM374 466H57V150h208v78h-45c-3 0-6 2-8 4l-52 72-26-19a9 9 0 0 0-14 6l-13 115a9 9 0 0 0 13 9l105-46a9 9 0 0 0 2-16l-26-19 40-54h24v89c0 12 10 21 22 21h87v76zm83-119H309v-70h148v70zm0-114H309v-70h148v70z" fill="currentColor"/>
  </svg>
);

const ViewSequenceSvg = () => (
  <svg focusable="false" aria-hidden="true" viewBox="0 0 512 512" width="1em" height="1em">
    <path fillOpacity="0" pointerEvents="none" d="M0 0h512v512H0z"/>
    <g fill="currentColor">
      <path d="M300 386l1 17-255 1c-21 0-39 8-39 18l1 36c0 9 17 17 38 17l255-1v19c0 5 5 9 13 11s18 2 28-2l150-52c8-3 13-7 13-12 0-4-5-8-13-11l-151-51c-9-3-19-4-28-2-8 2-13 6-13 12zM169 8L19 60c-8 3-13 7-13 12 0 4 5 9 13 11l151 51c9 3 19 4 28 2 8-2 13-6 13-12l-1-18 255-1c21 0 39-8 38-18V52c0-10-17-18-38-18l-255 1V17c0-5-5-9-13-11s-18-1-28 2z"/>
    </g>
    <g fill="currentColor">
      <path className="st16" d="M475 235c-198-204-371-48-416 1-7 8-7 18 0 26 45 49 218 205 416 0 8-8 8-19 0-27zM267 343c-59 0-106-39-106-87s47-87 106-87 107 39 107 87-48 87-107 87z"/>
      <path className="st17" d="M331 235c-5 6-13 10-23 10-15 0-28-11-28-23 0-7 3-13 9-17l-18-2c-37 0-66 24-66 54s29 53 66 53 65-24 65-53c0-8-2-15-5-22z"/>
    </g>
  </svg>
);

const DecimalPositionsSvg = () => (
  <svg focusable="false" aria-hidden="true" viewBox="0 0 512 512" width="1em" height="1em">
    <path pointerEvents="none" fill="none" d="M0 0h512v512H0z"/>
    <path d="M118.3 472.8h23c-.4 16.8-5.1 18.8-11.1 19.3l-2.3.3v18.5l2.6-.2c7.9-.4 16.5-1.8 22.3-9 5-6.2 7.3-16.4 7.3-32v-29h-41.8v32.1zM471.7 352.2A68.3 68.3 0 0 0 459 327a47 47 0 0 0-19.5-14 72.6 72.6 0 0 0-25.5-4.3c-9.3 0-17.7 1.5-25.3 4.3s-14.2 7.5-19.5 14a66.1 66.1 0 0 0-12.6 25.2c-2.9 10.4-4.4 23.1-4.4 38v30.5c0 15 1.5 27.7 4.5 38.1 2.9 10.5 7.2 19 12.6 25.5s12 11.3 19.6 14.2 16 4.4 25.3 4.4 17.8-1.5 25.3-4.4 14-7.7 19.4-14.2c5.4-6.6 9.6-15 12.5-25.5s4.4-23.1 4.4-38h.2v-30.6c0-14.9-1.5-27.6-4.4-38zm-27.3 73c0 9.6-.7 17.7-2 24.3-1.2 6.7-3.1 12-5.7 16.3a23.4 23.4 0 0 1-9.4 9c-3.7 2-8 3-13 3-4.9 0-9.2-1-13-3-3.8-1.9-7-4.9-9.6-9a49.8 49.8 0 0 1-6-16.3c-1.4-6.6-2.1-14.7-2.1-24.2v-40c0-9.5.7-17.6 2-24.1s3.3-11.8 6-15.9c2.5-4 5.7-6.8 9.5-8.6 3.7-1.8 8-2.7 12.9-2.7s9.2.9 13 2.7c3.7 1.7 6.9 4.6 9.5 8.6s4.5 9.4 5.9 15.9 2 14.5 2 24.2v39.9zM313 352.9a68.3 68.3 0 0 0-12.6-25.3 47 47 0 0 0-19.6-14 72.6 72.6 0 0 0-25.5-4.2c-9.2 0-17.7 1.4-25.3 4.3s-14.1 7.5-19.5 14a66.1 66.1 0 0 0-12.5 25.2c-3 10.4-4.4 23-4.4 38v30.5c0 15 1.5 27.6 4.4 38 3 10.5 7.2 19 12.7 25.5s12 11.3 19.5 14.2 16.1 4.4 25.4 4.4c9.3 0 17.7-1.4 25.3-4.4s14-7.7 19.4-14.2c5.4-6.5 9.6-15 12.5-25.4s4.4-23.2 4.4-38.1h.1v-30.5c0-15-1.5-27.6-4.4-38zm-27.3 73c0 9.5-.7 17.7-2 24.3-1.2 6.7-3.2 12-5.7 16.2a23.4 23.4 0 0 1-9.4 9.1c-3.8 1.9-8.1 2.9-13 2.9s-9.2-1-13-2.9c-3.8-2-7-4.9-9.7-9a49.8 49.8 0 0 1-6-16.3c-1.4-6.6-2-14.8-2-24.3V386c0-9.5.6-17.7 2-24.2s3.3-11.8 5.9-15.8c2.6-4 5.7-6.9 9.5-8.7 3.8-1.8 8.1-2.7 13-2.7s9.2 1 12.9 2.7c3.8 1.8 7 4.7 9.5 8.7s4.6 9.3 6 15.8 2 14.6 2 24.2v40z" fill="currentColor"/>
    <path d="M140.2 152.6l-100 100 100 99.8v-74.9H315v-50H140.2v-74.9zm349.7-50l-100-99.9v75H215.2v50H390v74.9l99.9-100z" fill="currentColor"/>
  </svg>
);

const OrderSvg = () => (
  <svg focusable="false" aria-hidden="true" viewBox="0 0 512 512" width="1em" height="1em">
     <path fillOpacity="0" pointerEvents="none" d="M0 0h512v512H0z"/>
    <g fill="currentColor">
      <path d="M46 90h186c23 0 41-18 41-41S255 7 232 7H46C23 7 5 26 5 49s18 41 41 41zm0-57c9 0 16 7 16 16s-7 16-16 16-16-7-16-16 7-16 16-16zM233 144H47c-23 0-41 18-41 41s18 42 41 42h186c23 0 41-19 41-42s-18-41-41-41zM47 201c-9 0-16-7-16-16s7-17 16-17 16 8 16 17-7 16-16 16z"/>
    </g>
    <path d="M234 419H48c-23 0-41 19-41 42s18 41 41 41h186a41 41 0 1 0 0-83zM48 477c-9 0-17-7-17-16s8-16 17-16 16 7 16 16-8 16-16 16z" fill="currentColor"/>
    <g fill="currentColor">
      <path d="M370 300h-17V45c0-21-8-38-18-38h-36c-10 0-18 17-18 38v255h-18c-6 0-10 5-12 13s-1 18 2 28l51 150c3 9 8 14 12 14 5 0 9-5 12-14l51-150c3-9 4-20 2-28s-6-13-11-13zM505 170L454 20c-3-9-8-14-12-14-5 0-9 5-12 14l-51 150c-4 10-4 20-2 28s6 13 11 13h18v255c0 21 8 38 18 38h36c9 0 17-17 17-38V211h18c6 0 10-5 12-13s1-18-2-28z"/>
    </g>
    <path d="M208 279H42c-20 0-36 19-36 42 0 22 16 41 36 41h166c20 0 36-19 36-41 0-23-16-42-36-42zM42 337c-8 0-14-8-14-17s6-16 14-16 14 7 14 16-6 17-14 17z" fill="currentColor"/>
  </svg>
);

const VerticalAnalysisSvg = () => (
  <svg focusable="false" aria-hidden="true" viewBox="0 0 512 512" width="1em" height="1em">
    <path fillOpacity="0" pointerEvents="none" d="M0 0h512v512H0z"/>
    <path d="M507 266c-2-6-8-10-15-10h-78V22c0-9-7-16-16-16H117c-9 0-16 7-16 16v234H23a16 16 0 0 0-11 27l235 219a16 16 0 0 0 21 0l235-219c5-4 6-11 4-17z" fill="currentColor"/>
    <g fill="#FAFAFA">
      <path d="M204 215a59 59 0 1 1 0-119 59 59 0 0 1 0 119zm0-79a20 20 0 1 0 0 40 20 20 0 0 0 0-40zM322 374a59 59 0 1 1 1-119 59 59 0 0 1-1 119zm0-80a20 20 0 1 0 1 40 20 20 0 0 0-1-40zM164 374c-4 0-9-2-13-5-8-7-9-20-2-28l198-238c7-8 19-9 28-2 8 7 9 19 2 28L179 366c-4 5-9 8-15 8z"/>
    </g>
  </svg>
);

const HorizontalAnalysisSvg = () => (
  <svg focusable="false" aria-hidden="true" viewBox="0 0 512 512" width="1em" height="1em">
    <path fillOpacity="0" pointerEvents="none" d="M0 0h512v512H0z"/>
    <path d="M267 7c-6 2-10 8-10 15v78H23c-9 0-16 7-16 16l1 282c0 8 7 15 15 15h235v78a16 16 0 0 0 27 11l219-236a16 16 0 0 0 0-21L284 11c-4-5-11-6-17-4z" fill="currentColor"/>
    <g fill="#FAFAFA">
      <path d="M182 235a59 59 0 1 1 0-119 59 59 0 0 1 0 119zm0-79a20 20 0 1 0 0 40 20 20 0 0 0 0-40zM301 394a59 59 0 1 1 0-119 59 59 0 0 1 0 119zm0-79a20 20 0 1 0 0 39 20 20 0 0 0 0-39zM143 394c-5 0-9-2-13-5-8-7-10-19-3-28l198-237c7-9 20-10 28-3 9 7 10 20 3 28L158 387c-4 4-10 7-15 7z"/>
    </g>
  </svg>
);

const AggregationSvg = () => (
  <svg focusable="false" aria-hidden="true" viewBox="0 0 512 512" width="1em" height="1em">
    <path pointerEvents="none" fill="none" d="M0 0h512v512H0z"/>
    <path pointerEvents="none" fill="none" d="M90.3 52.6h512v512h-512z"/>
    <path className="st1" d="M510.2 256.2a62.5 62.5 0 0 1-62.5 62.5 62.5 62.5 0 0 1-62.5-62.5 62.5 62.5 0 0 1 62.5-62.5 62.5 62.5 0 0 1 62.5 62.5z" fill="currentColor"/>
    <g fill="currentColor">
      <path className="st2" d="M330.4 341.1a62.5 62.5 0 1 1-125 0 62.5 62.5 0 0 1 125 0z"/>
      <path className="st1" d="M328.8 173.3a62.5 62.5 0 1 1-125 0 62.5 62.5 0 0 1 125 0z"/>
    </g>
    <g fill="currentColor">
      <path className="st2" d="M131.3 424.7a62.5 62.5 0 0 1-62.5 62.5 62.5 62.5 0 0 1-62.5-62.5 62.5 62.5 0 0 1 62.5-62.5 62.5 62.5 0 0 1 62.5 62.5z"/>
      <path className="st1" d="M131.1 256.5A62.5 62.5 0 0 1 68.6 319a62.5 62.5 0 0 1-62.5-62.5A62.5 62.5 0 0 1 68.6 194a62.5 62.5 0 0 1 62.5 62.5zM131.2 89.7a62.5 62.5 0 0 1-62.5 62.5A62.5 62.5 0 0 1 6.2 89.7a62.5 62.5 0 0 1 62.5-62.5 62.5 62.5 0 0 1 62.5 62.5z"/>
    </g>
    <path d="M179.5 180.4h46.3v-11.6h-46.3V85h-56.9v11.6H169v156h-46.3v11.6h56.9v-83.8zm-10.6 239.8h-46.3v11.6h56.9V348H226v-11.6h-57v83.8zm190-167.6v-83.8h-56.8v11.6h46.3v156h-46.3V348H359v-83.8h41v-11.6h-41z" fill="currentColor"/>
  </svg>
);

export const KeyIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={KeySvg} {...props} />
);

export const KeyFillIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={KeyFillSvg} {...props} />
);

export const FilterDataIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={FilterDataSvg} {...props} />
);

export const AddFilterIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={AddFilterSvg} {...props} />
);

export const SetSquareIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={SetSquareSvg} {...props} />
);

export const CubeStackIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={CubeStackSvg} {...props} />
);

export const DatabaseIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={DatabaseSvg} {...props} />
);

export const FunctionIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={FunctionSvg} {...props} />
);

export const CalculatorIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={CalculatorSvg} {...props} />
);

export const AddSequenceIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={AddSequenceSvg} {...props} />
);

export const OpenFolderIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={OpenFolderSvg} {...props} />
);

export const RefreshIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={RefreshSvg} {...props} />
);

export const InsertColumnIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={InsertColumnSvg} {...props} />
);

export const ViewSequenceIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={ViewSequenceSvg} {...props} />
);

export const DecimalPositionsIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={DecimalPositionsSvg} {...props} />
);

export const OrderIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={OrderSvg} {...props} />
);

export const VerticalAnalysisIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={VerticalAnalysisSvg} {...props} />
);

export const HorizontalAnalysisIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={HorizontalAnalysisSvg} {...props } />
);

export const AggregationIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={AggregationSvg} {...props } />
);
