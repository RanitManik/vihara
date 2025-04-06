import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export default function ServerBootNotice() {
    const [secondsLeft, setSecondsLeft] = useState(120);

    useEffect(() => {
        const timer = setInterval(() => {
            setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <section className="grid h-svh w-svw place-content-center overflow-hidden bg-blue-900">
            <div className="relative max-w-2xl overflow-hidden">
                {/* Main content */}
                <div className="relative mx-auto flex max-w-lg flex-col items-center space-y-4 rounded-2xl border border-white/20 bg-white/10 p-6 text-center text-white shadow-xl backdrop-blur-sm">
                    <Gears />
                    <h2 className="text-2xl font-bold">
                        Warming Up the Servers...
                    </h2>

                    <div className="flex items-center gap-4">
                        <Clock className="h-5 w-5" />
                        <div className="font-mono text-xl">
                            {formatTime(secondsLeft)}
                        </div>
                    </div>

                    <div className="text-sm text-white/80">
                        <p>
                            This app is powered by{" "}
                            <a
                                href="https://vercel.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-blue-300 underline hover:text-blue-200"
                            >
                                Vercel
                            </a>{" "}
                            (frontend) and{" "}
                            <a
                                href="https://render.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-blue-300 underline hover:text-blue-200"
                            >
                                Render
                            </a>{" "}
                            (backend).
                        </p>
                        <p className="mt-2">
                            Backend is spinning up on Render&#39;s free tier.
                            <br />
                            Usually takes less than <strong>2 minutes</strong>.
                        </p>
                    </div>

                    <div className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3">
                        <div className="h-2 rounded-full bg-white/20">
                            <div
                                className="h-full rounded-full bg-white transition-all duration-1000"
                                style={{
                                    width: `${((120 - secondsLeft) / 120) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Gears() {
    return (
        <div className="w-30 relative h-14">
            {/* Large gear */}
            <svg
                className="absolute left-0 top-0"
                width="56"
                height="56"
                viewBox="0 0 45.973 45.973"
                style={{
                    animation: "spin 8s linear infinite",
                    animationDuration: "5s",
                }}
            >
                <style>
                    {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes spinReverse {
              from { transform: rotate(360deg); }
              to { transform: rotate(0deg); }
            }
          `}
                </style>
                <path
                    fill="currentColor"
                    d="M43.454,18.443h-2.437c-0.453-1.766-1.16-3.42-2.082-4.933l1.752-1.756c0.473-0.473,0.733-1.104,0.733-1.774
          c0-0.669-0.262-1.301-0.733-1.773l-2.92-2.917c-0.947-0.948-2.602-0.947-3.545-0.001l-1.826,1.815
          C30.9,6.232,29.296,5.56,27.529,5.128V2.52c0-1.383-1.105-2.52-2.488-2.52h-4.128c-1.383,0-2.471,1.137-2.471,2.52v2.607
          c-1.766,0.431-3.38,1.104-4.878,1.977l-1.825-1.815c-0.946-0.948-2.602-0.947-3.551-0.001L5.27,8.205
          C4.802,8.672,4.535,9.318,4.535,9.978c0,0.669,0.259,1.299,0.733,1.772l1.752,1.76c-0.921,1.513-1.629,3.167-2.081,4.933H2.501
          C1.117,18.443,0,19.555,0,20.935v4.125c0,1.384,1.117,2.471,2.501,2.471h2.438c0.452,1.766,1.159,3.43,2.079,4.943l-1.752,1.763
          c-0.474,0.473-0.734,1.106-0.734,1.776s0.261,1.303,0.734,1.776l2.92,2.919c0.474,0.473,1.103,0.733,1.772,0.733
          s1.299-0.261,1.773-0.733l1.833-1.816c1.498,0.873,3.112,1.545,4.878,1.978v2.604c0,1.383,1.088,2.498,2.471,2.498h4.128
          c1.383,0,2.488-1.115,2.488-2.498v-2.605c1.767-0.432,3.371-1.104,4.869-1.977l1.817,1.812c0.474,0.475,1.104,0.735,1.775,0.735
          c0.67,0,1.301-0.261,1.774-0.733l2.92-2.917c0.473-0.472,0.732-1.103,0.734-1.772c0-0.67-0.262-1.299-0.734-1.773l-1.75-1.77
          c0.92-1.514,1.627-3.179,2.08-4.943h2.438c1.383,0,2.52-1.087,2.52-2.471v-4.125C45.973,19.555,44.837,18.443,43.454,18.443z
          M22.976,30.85c-4.378,0-7.928-3.517-7.928-7.852c0-4.338,3.55-7.85,7.928-7.85c4.379,0,7.931,3.512,7.931,7.85
          C30.906,27.334,27.355,30.85,22.976,30.85z"
                />
            </svg>

            {/* Small gear */}
            <svg
                className="absolute bottom-0 right-0"
                width="40"
                height="40"
                viewBox="0 0 45.973 45.973"
                style={{
                    animation: "spinReverse 6s linear infinite",
                    animationDuration: "5s",
                }}
            >
                <path
                    fill="currentColor"
                    d="M43.454,18.443h-2.437c-0.453-1.766-1.16-3.42-2.082-4.933l1.752-1.756c0.473-0.473,0.733-1.104,0.733-1.774
          c0-0.669-0.262-1.301-0.733-1.773l-2.92-2.917c-0.947-0.948-2.602-0.947-3.545-0.001l-1.826,1.815
          C30.9,6.232,29.296,5.56,27.529,5.128V2.52c0-1.383-1.105-2.52-2.488-2.52h-4.128c-1.383,0-2.471,1.137-2.471,2.52v2.607
          c-1.766,0.431-3.38,1.104-4.878,1.977l-1.825-1.815c-0.946-0.948-2.602-0.947-3.551-0.001L5.27,8.205
          C4.802,8.672,4.535,9.318,4.535,9.978c0,0.669,0.259,1.299,0.733,1.772l1.752,1.76c-0.921,1.513-1.629,3.167-2.081,4.933H2.501
          C1.117,18.443,0,19.555,0,20.935v4.125c0,1.384,1.117,2.471,2.501,2.471h2.438c0.452,1.766,1.159,3.43,2.079,4.943l-1.752,1.763
          c-0.474,0.473-0.734,1.106-0.734,1.776s0.261,1.303,0.734,1.776l2.92,2.919c0.474,0.473,1.103,0.733,1.772,0.733
          s1.299-0.261,1.773-0.733l1.833-1.816c1.498,0.873,3.112,1.545,4.878,1.978v2.604c0,1.383,1.088,2.498,2.471,2.498h4.128
          c1.383,0,2.488-1.115,2.488-2.498v-2.605c1.767-0.432,3.371-1.104,4.869-1.977l1.817,1.812c0.474,0.475,1.104,0.735,1.775,0.735
          c0.67,0,1.301-0.261,1.774-0.733l2.92-2.917c0.473-0.472,0.732-1.103,0.734-1.772c0-0.67-0.262-1.299-0.734-1.773l-1.75-1.77
          c0.92-1.514,1.627-3.179,2.08-4.943h2.438c1.383,0,2.52-1.087,2.52-2.471v-4.125C45.973,19.555,44.837,18.443,43.454,18.443z
          M22.976,30.85c-4.378,0-7.928-3.517-7.928-7.852c0-4.338,3.55-7.85,7.928-7.85c4.379,0,7.931,3.512,7.931,7.85
          C30.906,27.334,27.355,30.85,22.976,30.85z"
                />
            </svg>
        </div>
    );
}
