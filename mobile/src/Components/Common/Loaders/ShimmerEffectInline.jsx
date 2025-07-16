import React from 'react'

const ShimmerEffectInline = () => {
    return (

        <>
            <div className="w-full">
                <div className="m-5 space-y-3">

                    <div className="overflow-hidden rounded-lg relative space-y-5 bg-gradient-to-r to-transparent shadow-xl shadow-black/5 before:absolute before:inset-0 before:-translate-x-full before:animate-ping before:border-t before:border-gray-400 before:bg-gradient-to-r before:from-transparent before:via-gray-400 before:to-transparent">
                        <div className="h-4 rounded-lg bg-gray-300"></div>
                    </div>
                    <div className="overflow-hidden rounded-lg relative space-y-5 bg-gradient-to-r to-transparent shadow-xl shadow-black/5 before:absolute before:inset-0 before:-translate-x-full before:animate-ping before:border-t before:border-gray-400 before:bg-gradient-to-r before:from-transparent before:via-gray-400 before:to-transparent">
                        <div className="h-4 rounded-lg bg-gray-300"></div>
                    </div>
                    <div className="overflow-hidden rounded-lg relative space-y-5 bg-gradient-to-r to-transparent shadow-xl shadow-black/5 before:absolute before:inset-0 before:-translate-x-full before:animate-ping before:border-t before:border-gray-400 before:bg-gradient-to-r before:from-transparent before:via-gray-400 before:to-transparent">
                        <div className="h-4 rounded-lg bg-gray-300"></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ShimmerEffectInline