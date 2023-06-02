import './ButtonAction.scss';

interface Props {
  text: string;
  type?: string;
  disabled?: boolean;
  handler: () => void;
}

export const ButtonAction: React.FC<Props> = ({
  text,
  type,
  disabled,
  handler,
}) => {
  return (
    <div
      className={`button-action-component ${type ? type : 'primary'} ${
        disabled ? 'disabled' : ''
      }`}
      onClick={() => handler()}
    >
      {text}
    </div>
  );
};
