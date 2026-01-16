
const LoadingSpinner = () => {
    return (
        <>
            <div className="flex flex-col h-full w-full items-center justify-center min-h-[400px] gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        </>
    )
}

export default LoadingSpinner;