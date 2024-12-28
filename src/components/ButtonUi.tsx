interface buttonUIProps {
  name: string,
  handleClick?: (e:React.FormEvent)=>void;
  btnType: string;
  type?: "submit"|"button";
}
const ButtonUI = ({ name, handleClick, btnType ,type='button'}: buttonUIProps) => {
  return (
    <>
      <button type={type} onClick={(e) => handleClick && handleClick(e)} className={btnType}>{name}</button>
    </>
  )
}
export default ButtonUI