import { useState } from 'react';

const WarningBanner = () => {
	const [dismissed, setDismissed] = useState(false);

	if (dismissed) return null;

	return (
		<div className="w-full bg-yellow-500 text-black text-center text-[0.8125rem] font-medium px-4 py-2 flex items-center justify-center gap-2 relative z-50">
			<span>
				⚠️ This is <strong>Lambert Nenemse&apos;s student demo project</strong> and is not affiliated with, endorsed by, or associated with{' '}
				<strong>Coinbase</strong>. Do not enter real personal or financial information.
			</span>
			<button
				onClick={() => setDismissed(true)}
				className="absolute right-3 top-1/2 -translate-y-1/2 text-black/60 hover:text-black text-lg font-bold leading-none"
				aria-label="Dismiss banner"
			>
				×
			</button>
		</div>
	);
};

export default WarningBanner;
