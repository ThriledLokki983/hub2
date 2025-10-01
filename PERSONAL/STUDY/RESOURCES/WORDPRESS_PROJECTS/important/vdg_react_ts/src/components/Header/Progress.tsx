import Style from './header.style';

interface ProgressProps {
	progress: number;
}

const Progress = ({ progress }: ProgressProps) => {
	return (
		<Style.Info>
			<Style.InfoProgress>
				<Style.Progress>
					<Style.ProgressBar
						role='progressbar'
						aria-valuemax={100}
						aria-valuemin={0}
						aria-valuenow={25}
						style={{ width: `${progress}%` }}
					/>
				</Style.Progress>
			</Style.InfoProgress>
		</Style.Info>
	);
};

export default Progress;
